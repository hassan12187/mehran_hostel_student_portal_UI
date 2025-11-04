import { useState } from "react";
import Axios from "../../../components/Reusable/Axios";
import { useCustom } from "../../../context/Store";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password, 4: success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const {token,setToken}=useCustom();
  const navigate = useNavigate();

  const handleEmailSubmit = async() => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    try {
        const result = await Axios.post("/static/forgot-password",{email});
        console.log(result);
        if(result.status==200)window.alert(result.response.data);
        
    } catch (err) {
        if(err.status==400)window.alert(err.response.data);
        console.log(err);
    }
    setLoading(false);
    startTimer();
    setStep(2);
  };

  const startTimer = () => {
    setCanResend(false);
    setTimer(60);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpSubmit = async() => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");
    try {
        const result = await Axios.post("/static/verify-code",{email,code:otpValue});
        if(result.status==200){
            setToken(result.data.token);
        };
        setStep(3);
    } catch (err) {
        window.alert("There has been problem please redo the process.");
        setStep(1);
    }
      setLoading(false);
  };

  const handlePasswordSubmit =async() => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    try {
        const result = await Axios.patch("/static/change-password",{password:newPassword,token});
        console.log(result);
        if(result.status==200){
            window.alert(result.data)
        }
    } catch (error) {
        window.alert("There has been Error.");
        console.log(error);
    }
    navigate("/login");
      setLoading(false);
      setStep(4);
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      startTimer();
      setOtp(["", "", "", "", "", ""]);
    }, 1000);
  };

  return (
    <div className="forgot-password-container">
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="glass-card">
        {/* Progress Indicator */}
        <div className="progress-steps">
          {[1, 2, 3].map((s) => (
            <div key={s} className="step-wrapper">
              <div className={`step ${step >= s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                {step > s ? <i className="fas fa-check"></i> : s}
              </div>
              {s < 3 && <div className={`step-line ${step > s ? 'completed' : ''}`}></div>}
            </div>
          ))}
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="step-content fade-in">
            <div className="icon-wrapper">
              <i className="fas fa-envelope"></i>
            </div>
            <h1>Forgot Password?</h1>
            <p className="subtitle">No worries! Enter your email and we'll send you a reset code.</p>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="your.email@example.com"
                  className={error ? "error" : ""}
                />
              </div>
              {error && <span className="error-text">{error}</span>}
            </div>

            <button 
              className="primary-btn"
              onClick={handleEmailSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Code
                  <i className="fas fa-arrow-right"></i>
                </>
              )}
            </button>

            <button className="back-btn" onClick={() => window.history.back()}>
              <i className="fas fa-arrow-left"></i>
              Back to Login
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="step-content fade-in">
            <div className="icon-wrapper">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h1>Verify Code</h1>
            <p className="subtitle">We sent a 6-digit code to <strong>{email}</strong></p>

            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`otp-input ${error ? 'error' : ''}`}
                />
              ))}
            </div>
            {error && <span className="error-text">{error}</span>}

            <div className="timer-section">
              {!canResend ? (
                <p className="timer-text">
                  <i className="fas fa-clock"></i>
                  Resend code in {timer}s
                </p>
              ) : (
                <button className="resend-btn" onClick={handleResendOtp} disabled={loading}>
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Sending...</>
                  ) : (
                    <><i className="fas fa-redo"></i> Resend Code</>
                  )}
                </button>
              )}
            </div>

            <button 
              className="primary-btn"
              onClick={handleOtpSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Verifying...
                </>
              ) : (
                <>
                  Verify Code
                  <i className="fas fa-arrow-right"></i>
                </>
              )}
            </button>

            <button className="back-btn" onClick={() => setStep(1)}>
              <i className="fas fa-arrow-left"></i>
              Change Email
            </button>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="step-content fade-in">
            <div className="icon-wrapper">
              <i className="fas fa-lock"></i>
            </div>
            <h1>Create New Password</h1>
            <p className="subtitle">Your new password must be different from previously used passwords.</p>

            <div className="input-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter new password"
                  className={error ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Confirm new password"
                  className={error ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              {error && <span className="error-text">{error}</span>}
            </div>

            <div className="password-hints">
              <p>Password must contain:</p>
              <ul>
                <li className={newPassword.length >= 8 ? "valid" : ""}>
                  <i className="fas fa-check-circle"></i> At least 8 characters
                </li>
                <li className={/[A-Z]/.test(newPassword) ? "valid" : ""}>
                  <i className="fas fa-check-circle"></i> One uppercase letter
                </li>
                <li className={/[a-z]/.test(newPassword) ? "valid" : ""}>
                  <i className="fas fa-check-circle"></i> One lowercase letter
                </li>
                <li className={/\d/.test(newPassword) ? "valid" : ""}>
                  <i className="fas fa-check-circle"></i> One number
                </li>
              </ul>
            </div>

            <button 
              className="primary-btn"
              onClick={handlePasswordSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <i className="fas fa-check"></i>
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="step-content fade-in success-content">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1>Password Reset Successful!</h1>
            <p className="subtitle">Your password has been successfully reset. You can now login with your new password.</p>

            <button 
              className="primary-btn"
              onClick={() => window.location.href = '/login'}
            >
              Go to Login
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .forgot-password-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .animated-background {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.6;
          animation: float 20s infinite ease-in-out;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(45deg, #f093fb, #f5576c);
          bottom: -150px;
          right: -150px;
          animation-delay: 7s;
        }

        .orb-3 {
          width: 350px;
          height: 350px;
          background: linear-gradient(45deg, #4facfe, #00f2fe);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 14s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, 50px) scale(1.1); }
          50% { transform: translate(0, 100px) scale(0.9); }
          75% { transform: translate(-50px, 50px) scale(1.05); }
        }

        .glass-card {
          position: relative;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 48px;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .progress-steps {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 40px;
        }

        .step-wrapper {
          display: flex;
          align-items: center;
        }

        .step {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e5e7eb;
          color: #9ca3af;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .step.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: scale(1.1);
        }

        .step.completed {
          background: #10b981;
          color: white;
        }

        .step-line {
          width: 60px;
          height: 3px;
          background: #e5e7eb;
          transition: all 0.3s ease;
        }

        .step-line.completed {
          background: #10b981;
        }

        .step-content {
          text-align: center;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          color: white;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 12px;
        }

        .subtitle {
          color: #6b7280;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .subtitle strong {
          color: #667eea;
          font-weight: 600;
        }

        .input-group {
          margin-bottom: 24px;
          text-align: left;
        }

        .input-group label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 16px;
        }

        input[type="email"],
        input[type="text"],
        input[type="password"] {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: white;
          outline: none;
        }

        input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        input.error {
          border-color: #ef4444;
        }

        .toggle-visibility {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 8px;
          font-size: 18px;
          transition: color 0.2s;
        }

        .toggle-visibility:hover {
          color: #667eea;
        }

        .error-text {
          display: block;
          color: #ef4444;
          font-size: 13px;
          margin-top: 6px;
        }

        .otp-container {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 24px;
        }

        .otp-input {
          width: 56px;
          height: 56px;
          text-align: center;
          font-size: 24px;
          font-weight: 600;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: white;
          outline: none;
          padding: 0;
        }

        .otp-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          transform: scale(1.05);
        }

        .otp-input.error {
          border-color: #ef4444;
          animation: shake 0.3s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .timer-section {
          margin-bottom: 24px;
        }

        .timer-text {
          color: #6b7280;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .resend-btn {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 auto;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .resend-btn:hover:not(:disabled) {
          background: rgba(102, 126, 234, 0.1);
        }

        .resend-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .password-hints {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
          text-align: left;
        }

        .password-hints p {
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .password-hints ul {
          list-style: none;
          padding: 0;
        }

        .password-hints li {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #9ca3af;
          font-size: 13px;
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .password-hints li:last-child {
          margin-bottom: 0;
        }

        .password-hints li.valid {
          color: #10b981;
        }

        .password-hints li i {
          font-size: 14px;
        }

        .primary-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          margin-bottom: 16px;
        }

        .primary-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
        }

        .primary-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .back-btn {
          width: 100%;
          padding: 14px;
          background: transparent;
          color: #6b7280;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .success-content {
          padding: 20px 0;
        }

        .success-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 32px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: white;
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
          animation: scaleIn 0.5s ease;
        }

        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        @media (max-width: 576px) {
          .glass-card {
            padding: 32px 24px;
          }

          h1 {
            font-size: 24px;
          }

          .otp-input {
            width: 48px;
            height: 48px;
            font-size: 20px;
          }

          .step {
            width: 36px;
            height: 36px;
            font-size: 14px;
          }

          .step-line {
            width: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
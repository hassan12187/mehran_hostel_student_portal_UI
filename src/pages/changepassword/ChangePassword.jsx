import { useState } from "react";
import Axios from "../../components/Reusable/Axios";
import { useCustom } from "../../context/Store";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    label: "",
    color: ""
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const {token}=useCustom();
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const strengthMap = {
      0: { label: "", color: "" },
      1: { label: "Very Weak", color: "#dc3545" },
      2: { label: "Weak", color: "#fd7e14" },
      3: { label: "Fair", color: "#ffc107" },
      4: { label: "Good", color: "#20c997" },
      5: { label: "Strong", color: "#28a745" }
    };

    return { strength, ...strengthMap[strength] };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
    setSuccess(false);

    if (name === "newPassword") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    console.log(formData);
    // Simulate API call
    const result = await Axios.patch(`/api/student/change-password`,formData,{
        headers:{
            Authorization:`Bearer ${token}`
        },
        withCredentials:true
    });
    console.log(result);
    // setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordStrength({ strength: 0, label: "", color: "" });
    // }, 1500);
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <div className="card-header">
          <div className="header-icon">
            <i className="fas fa-lock"></i>
          </div>
          <h2>Change Password</h2>
          <p>Update your password to keep your account secure</p>
        </div>

        {success && (
          <div className="alert alert-success">
            <i className="fas fa-check-circle"></i>
            <span>Password changed successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="password-form">
          {/* Current Password */}
          <div className="form-group">
            <label htmlFor="currentPassword">
              <i className="fas fa-key"></i> Current Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.current ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={errors.currentPassword ? "error" : ""}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility("current")}
              >
                <i className={`fas ${showPasswords.current ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {errors.currentPassword && (
              <span className="error-message">
                <i className="fas fa-exclamation-circle"></i> {errors.currentPassword}
              </span>
            )}
          </div>

          {/* New Password */}
          <div className="form-group">
            <label htmlFor="newPassword">
              <i className="fas fa-lock"></i> New Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={errors.newPassword ? "error" : ""}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility("new")}
              >
                <i className={`fas ${showPasswords.new ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {errors.newPassword && (
              <span className="error-message">
                <i className="fas fa-exclamation-circle"></i> {errors.newPassword}
              </span>
            )}
            
            {/* Password Strength Meter */}
            {formData.newPassword && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[1, 2, 3, 4, 5].map((bar) => (
                    <div
                      key={bar}
                      className={`strength-bar ${bar <= passwordStrength.strength ? "active" : ""}`}
                      style={{
                        backgroundColor: bar <= passwordStrength.strength ? passwordStrength.color : "#e9ecef"
                      }}
                    ></div>
                  ))}
                </div>
                <span className="strength-label" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-check-circle"></i> Confirm New Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error" : ""}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                <i className={`fas ${showPasswords.confirm ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">
                <i className="fas fa-exclamation-circle"></i> {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Password Requirements */}
          <div className="password-requirements">
            <h4><i className="fas fa-info-circle"></i> Password Requirements:</h4>
            <ul>
              <li className={formData.newPassword.length >= 8 ? "met" : ""}>
                <i className={`fas ${formData.newPassword.length >= 8 ? "fa-check-circle" : "fa-circle"}`}></i>
                At least 8 characters long
              </li>
              <li className={/[A-Z]/.test(formData.newPassword) && /[a-z]/.test(formData.newPassword) ? "met" : ""}>
                <i className={`fas ${/[A-Z]/.test(formData.newPassword) && /[a-z]/.test(formData.newPassword) ? "fa-check-circle" : "fa-circle"}`}></i>
                Contains uppercase and lowercase letters
              </li>
              <li className={/\d/.test(formData.newPassword) ? "met" : ""}>
                <i className={`fas ${/\d/.test(formData.newPassword) ? "fa-check-circle" : "fa-circle"}`}></i>
                Contains at least one number
              </li>
              <li className={/[^a-zA-Z0-9]/.test(formData.newPassword) ? "met" : ""}>
                <i className={`fas ${/[^a-zA-Z0-9]/.test(formData.newPassword) ? "fa-check-circle" : "fa-circle"}`}></i>
                Contains at least one special character
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" className="btn btn-cancel">
              <i className="fas fa-times"></i> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .change-password-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .change-password-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 500px;
          width: 100%;
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }

        .header-icon {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 36px;
        }

        .card-header h2 {
          font-size: 28px;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .card-header p {
          font-size: 14px;
          opacity: 0.9;
        }

        .password-form {
          padding: 30px;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 8px;
          margin: 0 30px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }

        .alert-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .password-input-wrapper {
          position: relative;
        }

        .form-group input {
          width: 100%;
          padding: 12px 45px 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-group input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input.error {
          border-color: #dc3545;
        }

        .toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #718096;
          cursor: pointer;
          padding: 8px;
          font-size: 18px;
          transition: color 0.2s;
        }

        .toggle-password:hover {
          color: #667eea;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #dc3545;
          font-size: 13px;
          margin-top: 6px;
        }

        .password-strength {
          margin-top: 12px;
        }

        .strength-bars {
          display: flex;
          gap: 6px;
          margin-bottom: 6px;
        }

        .strength-bar {
          height: 4px;
          flex: 1;
          border-radius: 2px;
          background: #e9ecef;
          transition: background-color 0.3s ease;
        }

        .strength-label {
          font-size: 12px;
          font-weight: 600;
        }

        .password-requirements {
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .password-requirements h4 {
          font-size: 14px;
          color: #2d3748;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .password-requirements ul {
          list-style: none;
          padding: 0;
        }

        .password-requirements li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #718096;
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .password-requirements li:last-child {
          margin-bottom: 0;
        }

        .password-requirements li.met {
          color: #28a745;
        }

        .password-requirements li i {
          font-size: 14px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .btn {
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #475569;
        }

        .btn-cancel:hover {
          background: #e2e8f0;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 576px) {
          .change-password-card {
            margin: 0;
          }

          .card-header {
            padding: 30px 20px;
          }

          .password-form {
            padding: 20px;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ChangePassword;
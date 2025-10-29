import React, { useState } from 'react';
import './Mess.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUtensils,
  faCalendarAlt,
  faClipboardList,
  faMoneyBillWave,
  faStar,
  faHeart,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faUser,
  faEdit,
  faHistory,
  faChartBar,
  faBell
} from '@fortawesome/free-solid-svg-icons';

const Mess = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mess Statistics
  const messStats = {
    monthlyBill: 8500,
    paidAmount: 8500,
    dueAmount: 0,
    currency: "PKR",
    attendance: "94%",
    mealsThisMonth: 78,
    specialRequests: 2,
    feedbackSubmitted: 5
  };

  // Weekly Menu Data
  const weeklyMenu = {
    [selectedDate]: {
      breakfast: {
        name: "Breakfast",
        items: [
          "Anday (Eggs)",
          "Paratha",
          "Chai",
          "Dahi (Yogurt)"
        ],
        timing: "7:00 AM - 9:00 AM",
        rating: 4.2
      },
      lunch: {
        name: "Lunch",
        items: [
          "Chicken Karahi",
          "Daal Maash",
          "Chawal (Rice)",
          "Raita",
          "Salad"
        ],
        timing: "12:30 PM - 2:30 PM",
        rating: 4.5
      },
      dinner: {
        name: "Dinner",
        items: [
          "Beef Pulao",
          "Chana Masala",
          "Kachumbar Salad",
          "Pickle",
          "Kheer (Dessert)"
        ],
        timing: "7:00 PM - 9:00 PM",
        rating: 4.3
      }
    }
  };

  // Sample Menu for different days
  const sampleMenus = {
    '2024-01-22': {
      breakfast: ["Omelette", "Paratha", "Chai", "Fruit"],
      lunch: ["Chicken Biryani", "Raita", "Salad", "Kachumber"],
      dinner: ["Beef Nihari", "Kulcha", "Salad", "Zarda"]
    },
    '2024-01-23': {
      breakfast: ["Halwa Puri", "Chana", "Chai"],
      lunch: ["Fish Curry", "Steamed Rice", "Daal", "Salad"],
      dinner: ["Chicken Korma", "Na", "Raita", "Fruit"]
    }
  };

  // Current day's menu
  const currentMenu = weeklyMenu[selectedDate] || weeklyMenu[new Date().toISOString().split('T')[0]];

  // Attendance History
  const attendanceHistory = [
    { date: '2024-01-21', breakfast: true, lunch: true, dinner: false, total: 2 },
    { date: '2024-01-20', breakfast: true, lunch: true, dinner: true, total: 3 },
    { date: '2024-01-19', breakfast: false, lunch: true, dinner: true, total: 2 },
    { date: '2024-01-18', breakfast: true, lunch: true, dinner: true, total: 3 },
    { date: '2024-01-17', breakfast: true, lunch: false, dinner: true, total: 2 }
  ];

  // Special Requests
  const [specialRequests, setSpecialRequests] = useState([
    {
      id: 1,
      type: "dietary",
      description: "No spicy food due to medical reasons",
      status: "approved",
      date: "2024-01-15",
      response: "Request approved. Mild food will be provided."
    },
    {
      id: 2,
      type: "guest",
      description: "Guest meal for parents visiting on weekend",
      status: "pending",
      date: "2024-01-20",
      response: ""
    }
  ]);

  // Feedback History
  const feedbackHistory = [
    {
      id: 1,
      date: "2024-01-18",
      meal: "Dinner",
      rating: 4,
      comment: "Chicken Karahi was excellent today!",
      response: "Thank you for your feedback! We're glad you enjoyed it."
    },
    {
      id: 2,
      date: "2024-01-15",
      meal: "Breakfast",
      rating: 3,
      comment: "Paratha could be less oily",
      response: "Noted. We'll adjust the oil quantity."
    }
  ];

  // New Request State
  const [newRequest, setNewRequest] = useState({
    type: "",
    description: "",
    date: ""
  });

  // New Feedback State
  const [newFeedback, setNewFeedback] = useState({
    meal: "",
    rating: 0,
    comment: ""
  });

  const tabs = [
    { id: 'menu', label: 'Weekly Menu', icon: faUtensils },
    { id: 'attendance', label: 'Attendance', icon: faClipboardList },
    { id: 'billing', label: 'Mess Bill', icon: faMoneyBillWave },
    { id: 'requests', label: 'Special Requests', icon: faBell },
    { id: 'feedback', label: 'Feedback', icon: faStar }
  ];

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-PK', { weekday: 'long' });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return { icon: faCheckCircle, color: '#10b981', label: 'Approved' };
      case 'pending':
        return { icon: faClock, color: '#f59e0b', label: 'Pending' };
      case 'rejected':
        return { icon: faExclamationTriangle, color: '#ef4444', label: 'Rejected' };
      default:
        return { icon: faClock, color: '#6b7280', label: 'Pending' };
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        className={index < rating ? 'star filled' : 'star'}
      />
    ));
  };

  const renderMenuTab = () => (
    <div className="menu-tab">
      <div className="menu-header">
        <h3>Weekly Mess Menu</h3>
        <div className="date-selector">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>

      <div className="current-day">
        <h4>{getDayName(selectedDate)} - {selectedDate}</h4>
        <p>Today's meal schedule and menu</p>
      </div>

      <div className="meals-grid">
        {Object.values(currentMenu).map((meal, index) => (
          <div key={index} className="meal-card">
            <div className="meal-header">
              <h4>{meal.name}</h4>
              <div className="meal-timing">
                <FontAwesomeIcon icon={faClock} />
                <span>{meal.timing}</span>
              </div>
            </div>

            <div className="meal-items">
              <h5>Menu Items:</h5>
              <ul>
                {meal.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="meal-rating">
              <div className="rating-stars">
                {renderStars(Math.floor(meal.rating))}
                <span className="rating-value">{meal.rating}</span>
              </div>
              <button className="rate-btn">
                <FontAwesomeIcon icon={faStar} />
                Rate This Meal
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="menu-notes">
        <div className="note-card">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <div>
            <strong>Important Notes:</strong>
            <ul>
              <li>Meal timings are strict. Latecomers may not be served.</li>
              <li>Special dietary requirements must be requested in advance.</li>
              <li>Wastage of food is strictly prohibited.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendanceTab = () => (
    <div className="attendance-tab">
      <div className="attendance-header">
        <h3>Meal Attendance</h3>
        <div className="attendance-stats">
          <div className="attendance-stat">
            <span className="stat-value">{messStats.attendance}</span>
            <span className="stat-label">Monthly Attendance</span>
          </div>
          <div className="attendance-stat">
            <span className="stat-value">{messStats.mealsThisMonth}</span>
            <span className="stat-label">Meals This Month</span>
          </div>
        </div>
      </div>

      <div className="attendance-chart">
        <div className="chart-placeholder">
          <FontAwesomeIcon icon={faChartBar} />
          <p>Attendance Chart Will Appear Here</p>
        </div>
      </div>

      <div className="attendance-history">
        <h4>Recent Attendance History</h4>
        <div className="history-table">
          <div className="table-header">
            <span>Date</span>
            <span>Breakfast</span>
            <span>Lunch</span>
            <span>Dinner</span>
            <span>Total</span>
          </div>
          {attendanceHistory.map((record, index) => (
            <div key={index} className="table-row">
              <span>{record.date}</span>
              <span>
                <FontAwesomeIcon 
                  icon={record.breakfast ? faCheckCircle : faTimesCircle} 
                  className={record.breakfast ? 'present' : 'absent'} 
                />
              </span>
              <span>
                <FontAwesomeIcon 
                  icon={record.lunch ? faCheckCircle : faTimesCircle} 
                  className={record.lunch ? 'present' : 'absent'} 
                />
              </span>
              <span>
                <FontAwesomeIcon 
                  icon={record.dinner ? faCheckCircle : faTimesCircle} 
                  className={record.dinner ? 'present' : 'absent'} 
                />
              </span>
              <span className="total-meals">{record.total}/3</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="billing-tab">
      <div className="billing-header">
        <h3>Mess Bill Details</h3>
        <div className="billing-period">
          <span>January 2024</span>
        </div>
      </div>

      <div className="billing-cards">
        <div className="bill-card total">
          <div className="card-icon">
            <FontAwesomeIcon icon={faMoneyBillWave} />
          </div>
          <div className="card-content">
            <h4>Total Monthly Bill</h4>
            <p className="amount">{messStats.currency} {messStats.monthlyBill.toLocaleString()}</p>
          </div>
        </div>

        <div className="bill-card paid">
          <div className="card-icon">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className="card-content">
            <h4>Amount Paid</h4>
            <p className="amount">{messStats.currency} {messStats.paidAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bill-card due">
          <div className="card-icon">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <div className="card-content">
            <h4>Due Amount</h4>
            <p className="amount">{messStats.currency} {messStats.dueAmount.toLocaleString()}</p>
            <span className="due-status">Fully Paid</span>
          </div>
        </div>
      </div>

      <div className="bill-details">
        <h4>Bill Breakdown</h4>
        <div className="breakdown-table">
          <div className="breakdown-row">
            <span>Basic Mess Charges</span>
            <span>{messStats.currency} 8,000</span>
          </div>
          <div className="breakdown-row">
            <span>Special Meal Charges</span>
            <span>{messStats.currency} 500</span>
          </div>
          <div className="breakdown-row">
            <span>Utility Charges</span>
            <span>{messStats.currency} 0</span>
          </div>
          <div className="breakdown-row total">
            <span>Total Amount</span>
            <span>{messStats.currency} 8,500</span>
          </div>
        </div>
      </div>

      <div className="billing-actions">
        <button className="btn btn-primary">
          <FontAwesomeIcon icon={faMoneyBillWave} />
          Pay Mess Bill
        </button>
        <button className="btn btn-outline">
          <FontAwesomeIcon icon={faDownload} />
          Download Bill
        </button>
        <button className="btn btn-outline">
          <FontAwesomeIcon icon={faHistory} />
          Payment History
        </button>
      </div>
    </div>
  );

  const renderRequestsTab = () => (
    <div className="requests-tab">
      <div className="requests-header">
        <h3>Special Requests</h3>
        <button 
          className="btn btn-primary"
          onClick={() => document.getElementById('requestModal').showModal()}
        >
          <FontAwesomeIcon icon={faEdit} />
          New Request
        </button>
      </div>

      <div className="requests-list">
        {specialRequests.map(request => {
          const statusInfo = getStatusInfo(request.status);
          
          return (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div className="request-type">
                  <span className={`type-badge ${request.type}`}>
                    {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                  </span>
                  <span className="request-date">{request.date}</span>
                </div>
                <div className="request-status" style={{ color: statusInfo.color }}>
                  <FontAwesomeIcon icon={statusInfo.icon} />
                  <span>{statusInfo.label}</span>
                </div>
              </div>

              <div className="request-description">
                <p>{request.description}</p>
              </div>

              {request.response && (
                <div className="request-response">
                  <strong>Response:</strong>
                  <p>{request.response}</p>
                </div>
              )}

              {request.status === 'pending' && (
                <div className="request-actions">
                  <button className="btn btn-outline small">
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                  <button className="btn btn-outline small danger">
                    <FontAwesomeIcon icon={faTimesCircle} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Request Modal */}
      <dialog id="requestModal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>New Special Request</h3>
            <button 
              className="close-btn"
              onClick={() => document.getElementById('requestModal').close()}
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            <form className="request-form">
              <div className="form-group">
                <label>Request Type</label>
                <select 
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
                  className="form-input"
                >
                  <option value="">Select Type</option>
                  <option value="dietary">Dietary Requirement</option>
                  <option value="guest">Guest Meal</option>
                  <option value="medical">Medical Diet</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date (if applicable)</label>
                <input
                  type="date"
                  value={newRequest.date}
                  onChange={(e) => setNewRequest({...newRequest, date: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                  placeholder="Please describe your request in detail..."
                  rows="4"
                  className="form-input textarea"
                ></textarea>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-outline"
                  onClick={() => document.getElementById('requestModal').close()}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );

  const renderFeedbackTab = () => (
    <div className="feedback-tab">
      <div className="feedback-header">
        <h3>Meal Feedback</h3>
        <div className="feedback-stats">
          <span>Submitted: {messStats.feedbackSubmitted} feedbacks</span>
        </div>
      </div>

      <div className="feedback-history">
        <h4>Your Recent Feedback</h4>
        {feedbackHistory.map(feedback => (
          <div key={feedback.id} className="feedback-card">
            <div className="feedback-header">
              <div className="feedback-meta">
                <span className="meal-type">{feedback.meal}</span>
                <span className="feedback-date">{feedback.date}</span>
              </div>
              <div className="feedback-rating">
                {renderStars(feedback.rating)}
              </div>
            </div>
            
            <div className="feedback-comment">
              <p>{feedback.comment}</p>
            </div>

            {feedback.response && (
              <div className="feedback-response">
                <strong>Mess Response:</strong>
                <p>{feedback.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="new-feedback">
        <h4>Submit New Feedback</h4>
        <form className="feedback-form">
          <div className="form-row">
            <div className="form-group">
              <label>Meal Type</label>
              <select 
                value={newFeedback.meal}
                onChange={(e) => setNewFeedback({...newFeedback, meal: e.target.value})}
                className="form-input"
              >
                <option value="">Select Meal</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div className="form-group">
              <label>Rating</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map(star => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className={star <= newFeedback.rating ? 'star filled selectable' : 'star selectable'}
                    onClick={() => setNewFeedback({...newFeedback, rating: star})}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Comments</label>
            <textarea
              value={newFeedback.comment}
              onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
              placeholder="Share your thoughts about the meal..."
              rows="3"
              className="form-input textarea"
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon={faStar} />
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="mess-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FontAwesomeIcon icon={faUtensils} />
            Mess Management
          </h1>
          <p>View menus, track attendance, manage bills, and provide feedback</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <FontAwesomeIcon icon={faUser} />
            <span>Mess: Boys Hostel</span>
          </div>
          <div className="stat-badge">
            <FontAwesomeIcon icon={faClipboardList} />
            <span>Attendance: {messStats.attendance}</span>
          </div>
        </div>
      </div>

      {/* Mess Tabs */}
      <div className="mess-tabs">
        <div className="tabs-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mess Content */}
      <div className="mess-content">
        {activeTab === 'menu' && renderMenuTab()}
        {activeTab === 'attendance' && renderAttendanceTab()}
        {activeTab === 'billing' && renderBillingTab()}
        {activeTab === 'requests' && renderRequestsTab()}
        {activeTab === 'feedback' && renderFeedbackTab()}
      </div>
    </div>
  );
};

export default Mess;
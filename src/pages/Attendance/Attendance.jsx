import React, { useState } from 'react';
import './Attendance.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck,
  faChartLine,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faDownload,
  faPrint,
  faCalendarAlt,
  faUser,
  faUtensils,
  faHome,
  faHistory,
  faSearch,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [searchTerm, setSearchTerm] = useState('');

  // Attendance Statistics
  const attendanceStats = {
    overall: {
      percentage: 94,
      present: 85,
      total: 90,
      absent: 5
    },
    mess: {
      percentage: 92,
      present: 78,
      total: 85,
      absent: 7
    },
    hostel: {
      percentage: 96,
      present: 86,
      total: 90,
      absent: 4
    }
  };

  // Current Month Data
  const currentMonthData = {
    month: "January 2024",
    workingDays: 30,
    presentDays: 28,
    absentDays: 2,
    leaveDays: 0
  };

  // Sample Attendance Records
  const attendanceRecords = [
    {
      id: 1,
      date: "2024-01-22",
      day: "Monday",
      mess: { breakfast: true, lunch: true, dinner: true },
      hostel: { morning: true, evening: true, night: true },
      status: "present",
      remarks: "All check-ins completed"
    },
    {
      id: 2,
      date: "2024-01-21",
      day: "Sunday",
      mess: { breakfast: false, lunch: true, dinner: true },
      hostel: { morning: true, evening: true, night: true },
      status: "present",
      remarks: "Missed breakfast"
    },
    {
      id: 3,
      date: "2024-01-20",
      day: "Saturday",
      mess: { breakfast: true, lunch: true, dinner: false },
      hostel: { morning: true, evening: true, night: false },
      status: "absent",
      remarks: "Went home for weekend"
    },
    {
      id: 4,
      date: "2024-01-19",
      day: "Friday",
      mess: { breakfast: true, lunch: true, dinner: true },
      hostel: { morning: true, evening: true, night: true },
      status: "present",
      remarks: "Regular attendance"
    },
    {
      id: 5,
      date: "2024-01-18",
      day: "Thursday",
      mess: { breakfast: true, lunch: false, dinner: true },
      hostel: { morning: true, evening: true, night: true },
      status: "present",
      remarks: "Missed lunch due to class"
    },
    {
      id: 6,
      date: "2024-01-17",
      day: "Wednesday",
      mess: { breakfast: true, lunch: true, dinner: true },
      hostel: { morning: true, evening: true, night: true },
      status: "present",
      remarks: "All check-ins completed"
    },
    {
      id: 7,
      date: "2024-01-16",
      day: "Tuesday",
      mess: { breakfast: false, lunch: false, dinner: false },
      hostel: { morning: false, evening: false, night: false },
      status: "absent",
      remarks: "Medical leave"
    }
  ];

  // Monthly Trends
  const monthlyTrends = [
    { month: 'Aug 2023', percentage: 92 },
    { month: 'Sep 2023', percentage: 94 },
    { month: 'Oct 2023', percentage: 91 },
    { month: 'Nov 2023', percentage: 95 },
    { month: 'Dec 2023', percentage: 93 },
    { month: 'Jan 2024', percentage: 94 }
  ];

  // Attendance Rules
  const attendanceRules = [
    {
      category: "Mess Attendance",
      rules: [
        "Breakfast: 7:00 AM - 9:00 AM",
        "Lunch: 12:30 PM - 2:30 PM", 
        "Dinner: 7:00 PM - 9:00 PM",
        "Latecomers will not be served",
        "Minimum 75% attendance required monthly"
      ]
    },
    {
      category: "Hostel Attendance",
      rules: [
        "Morning Check-in: 6:00 AM - 8:00 AM",
        "Evening Check-in: 5:00 PM - 7:00 PM",
        "Night Check-in: 9:00 PM - 11:00 PM",
        "Night out requires prior gate pass",
        "80% minimum attendance mandatory"
      ]
    },
    {
      category: "Leave Policy",
      rules: [
        "Medical leave requires doctor's certificate",
        "Emergency leave: Inform warden immediately",
        "Planned leave: Apply 3 days in advance",
        "Maximum 5 leaves per month allowed",
        "Exceeding limits may lead to fine"
      ]
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: faChartLine },
    { id: 'records', label: 'Daily Records', icon: faCalendarCheck },
    { id: 'trends', label: 'Monthly Trends', icon: faHistory },
    { id: 'rules', label: 'Rules', icon: faExclamationTriangle }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon present" />;
      case 'absent':
        return <FontAwesomeIcon icon={faTimesCircle} className="status-icon absent" />;
      default:
        return <FontAwesomeIcon icon={faClock} className="status-icon pending" />;
    }
  };

  const getMealStatus = (mealRecord) => {
    const meals = Object.values(mealRecord);
    const presentCount = meals.filter(meal => meal).length;
    const totalCount = meals.length;
    return { present: presentCount, total: totalCount };
  };

  const renderOverviewTab = () => (
    <div className="overview-tab">
      {/* Overall Stats */}
      <div className="stats-section">
        <h3>Overall Attendance Summary</h3>
        <div className="stats-grid">
          <div className="stat-card overall">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <div className="stat-content">
              <h4>{attendanceStats.overall.percentage}%</h4>
              <p>Overall Attendance</p>
              <div className="stat-details">
                <span>Present: {attendanceStats.overall.present}</span>
                <span>Absent: {attendanceStats.overall.absent}</span>
                <span>Total: {attendanceStats.overall.total}</span>
              </div>
            </div>
          </div>

          <div className="stat-card mess">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faUtensils} />
            </div>
            <div className="stat-content">
              <h4>{attendanceStats.mess.percentage}%</h4>
              <p>Mess Attendance</p>
              <div className="stat-details">
                <span>Present: {attendanceStats.mess.present}</span>
                <span>Absent: {attendanceStats.mess.absent}</span>
                <span>Total: {attendanceStats.mess.total}</span>
              </div>
            </div>
          </div>

          <div className="stat-card hostel">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faHome} />
            </div>
            <div className="stat-content">
              <h4>{attendanceStats.hostel.percentage}%</h4>
              <p>Hostel Attendance</p>
              <div className="stat-details">
                <span>Present: {attendanceStats.hostel.present}</span>
                <span>Absent: {attendanceStats.hostel.absent}</span>
                <span>Total: {attendanceStats.hostel.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Month Summary */}
      <div className="month-summary">
        <div className="summary-header">
          <h3>Current Month - {currentMonthData.month}</h3>
          <div className="month-actions">
            <button className="btn btn-outline">
              <FontAwesomeIcon icon={faDownload} />
              Download Report
            </button>
            <button className="btn btn-outline">
              <FontAwesomeIcon icon={faPrint} />
              Print
            </button>
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon working">
              <FontAwesomeIcon icon={faCalendarAlt} />
            </div>
            <div className="card-content">
              <h4>{currentMonthData.workingDays}</h4>
              <p>Working Days</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon present">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="card-content">
              <h4>{currentMonthData.presentDays}</h4>
              <p>Present Days</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon absent">
              <FontAwesomeIcon icon={faTimesCircle} />
            </div>
            <div className="card-content">
              <h4>{currentMonthData.absentDays}</h4>
              <p>Absent Days</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon leave">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="card-content">
              <h4>{currentMonthData.leaveDays}</h4>
              <p>Leave Days</p>
            </div>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span>Monthly Progress</span>
            <span>{Math.round((currentMonthData.presentDays / currentMonthData.workingDays) * 100)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(currentMonthData.presentDays / currentMonthData.workingDays) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Attendance</h3>
        <div className="activity-list">
          {attendanceRecords.slice(0, 5).map(record => (
            <div key={record.id} className="activity-item">
              <div className="activity-date">
                <strong>{record.date}</strong>
                <span>{record.day}</span>
              </div>
              <div className="activity-status">
                {getStatusIcon(record.status)}
                <span className={`status-text ${record.status}`}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
              </div>
              <div className="activity-details">
                <div className="detail">
                  <FontAwesomeIcon icon={faUtensils} />
                  <span>Mess: {getMealStatus(record.mess).present}/{getMealStatus(record.mess).total}</span>
                </div>
                <div className="detail">
                  <FontAwesomeIcon icon={faHome} />
                  <span>Hostel: {getMealStatus(record.hostel).present}/{getMealStatus(record.hostel).total}</span>
                </div>
              </div>
              <div className="activity-remarks">
                <span>{record.remarks}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecordsTab = () => (
    <div className="records-tab">
      <div className="records-header">
        <h3>Daily Attendance Records</h3>
        <div className="records-controls">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search by date or remarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-select"
          >
            <option value="2024-01">January 2024</option>
            <option value="2023-12">December 2023</option>
            <option value="2023-11">November 2023</option>
          </select>
        </div>
      </div>

      <div className="records-table">
        <div className="table-header">
          <span>Date</span>
          <span>Day</span>
          <span>Mess Attendance</span>
          <span>Hostel Attendance</span>
          <span>Status</span>
          <span>Remarks</span>
        </div>

        {attendanceRecords.map(record => (
          <div key={record.id} className="table-row">
            <span className="date-cell">
              <strong>{record.date}</strong>
            </span>
            <span className="day-cell">{record.day}</span>
            
            <span className="meal-cell">
              <div className="meal-status">
                <div className="meal-item">
                  <FontAwesomeIcon 
                    icon={record.mess.breakfast ? faCheckCircle : faTimesCircle} 
                    className={record.mess.breakfast ? 'present' : 'absent'} 
                  />
                  <span>Breakfast</span>
                </div>
                <div className="meal-item">
                  <FontAwesomeIcon 
                    icon={record.mess.lunch ? faCheckCircle : faTimesCircle} 
                    className={record.mess.lunch ? 'present' : 'absent'} 
                  />
                  <span>Lunch</span>
                </div>
                <div className="meal-item">
                  <FontAwesomeIcon 
                    icon={record.mess.dinner ? faCheckCircle : faTimesCircle} 
                    className={record.mess.dinner ? 'present' : 'absent'} 
                  />
                  <span>Dinner</span>
                </div>
              </div>
            </span>

            <span className="hostel-cell">
              <div className="hostel-status">
                <div className="check-in-item">
                  <FontAwesomeIcon 
                    icon={record.hostel.morning ? faCheckCircle : faTimesCircle} 
                    className={record.hostel.morning ? 'present' : 'absent'} 
                  />
                  <span>Morning</span>
                </div>
                <div className="check-in-item">
                  <FontAwesomeIcon 
                    icon={record.hostel.evening ? faCheckCircle : faTimesCircle} 
                    className={record.hostel.evening ? 'present' : 'absent'} 
                  />
                  <span>Evening</span>
                </div>
                <div className="check-in-item">
                  <FontAwesomeIcon 
                    icon={record.hostel.night ? faCheckCircle : faTimesCircle} 
                    className={record.hostel.night ? 'present' : 'absent'} 
                  />
                  <span>Night</span>
                </div>
              </div>
            </span>

            <span className="status-cell">
              <div className={`status-badge ${record.status}`}>
                {getStatusIcon(record.status)}
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </div>
            </span>

            <span className="remarks-cell">
              {record.remarks}
            </span>
          </div>
        ))}
      </div>

      <div className="records-actions">
        <button className="btn btn-primary">
          <FontAwesomeIcon icon={faDownload} />
          Export Records
        </button>
        <button className="btn btn-outline">
          <FontAwesomeIcon icon={faPrint} />
          Print Report
        </button>
      </div>
    </div>
  );

  const renderTrendsTab = () => (
    <div className="trends-tab">
      <div className="trends-header">
        <h3>Monthly Attendance Trends</h3>
        <p>Track your attendance performance over time</p>
      </div>

      <div className="trends-chart">
        <div className="chart-container">
          <div className="chart-bars">
            {monthlyTrends.map((trend, index) => (
              <div key={index} className="chart-bar-container">
                <div className="chart-bar">
                  <div 
                    className="bar-fill"
                    style={{ height: `${trend.percentage}%` }}
                  ></div>
                </div>
                <div className="chart-label">
                  <span>{trend.month}</span>
                  <strong>{trend.percentage}%</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="trends-stats">
        <div className="trend-stat">
          <h4>Best Month</h4>
          <div className="stat-value">
            {Math.max(...monthlyTrends.map(t => t.percentage))}%
          </div>
          <span>
            {monthlyTrends.find(t => t.percentage === Math.max(...monthlyTrends.map(t => t.percentage)))?.month}
          </span>
        </div>

        <div className="trend-stat">
          <h4>Average</h4>
          <div className="stat-value">
            {Math.round(monthlyTrends.reduce((acc, curr) => acc + curr.percentage, 0) / monthlyTrends.length)}%
          </div>
          <span>6 months average</span>
        </div>

        <div className="trend-stat">
          <h4>Improvement</h4>
          <div className="stat-value">
            {monthlyTrends[monthlyTrends.length - 1].percentage - monthlyTrends[0].percentage}%
          </div>
          <span>Since {monthlyTrends[0].month}</span>
        </div>
      </div>

      <div className="performance-insights">
        <h4>Performance Insights</h4>
        <div className="insights-list">
          <div className="insight-item positive">
            <FontAwesomeIcon icon={faCheckCircle} />
            <div>
              <strong>Consistent Performer</strong>
              <p>Your attendance has been consistently above 90% for the last 6 months</p>
            </div>
          </div>
          <div className="insight-item warning">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <div>
              <strong>Weekend Pattern</strong>
              <p>Lower attendance observed on weekends. Try to maintain regular schedule.</p>
            </div>
          </div>
          <div className="insight-item positive">
            <FontAwesomeIcon icon={faCheckCircle} />
            <div>
              <strong>Good Progress</strong>
              <p>2% improvement compared to first month. Keep it up!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRulesTab = () => (
    <div className="rules-tab">
      <div className="rules-header">
        <h3>Attendance Rules & Policies</h3>
        <p>Important guidelines for maintaining your attendance</p>
      </div>

      <div className="rules-categories">
        {attendanceRules.map((category, index) => (
          <div key={index} className="rules-category">
            <h4>
              <FontAwesomeIcon icon={faExclamationTriangle} />
              {category.category}
            </h4>
            <div className="rules-list">
              {category.rules.map((rule, ruleIndex) => (
                <div key={ruleIndex} className="rule-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="rule-icon" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="important-notices">
        <div className="notice-card critical">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <div className="notice-content">
            <h5>Critical Notices</h5>
            <ul>
              <li>Attendance below 75% may lead to disciplinary action</li>
              <li>Repeated absenteeism can result in hostel suspension</li>
              <li>Fake medical certificates will lead to strict penalties</li>
              <li>Always carry your hostel ID for attendance marking</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="contact-support">
        <div className="support-card">
          <h5>Need Help with Attendance?</h5>
          <p>If you have any issues with attendance marking or need to report discrepancies, contact:</p>
          <div className="contact-details">
            <div className="contact-item">
              <strong>Warden Office:</strong>
              <span>+92 21 1234567</span>
            </div>
            <div className="contact-item">
              <strong>Mess Incharge:</strong>
              <span>+92 300 9876543</span>
            </div>
            <div className="contact-item">
              <strong>Email:</strong>
              <span>attendance@hostel.edu.pk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="attendance-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FontAwesomeIcon icon={faCalendarCheck} />
            Attendance Management
          </h1>
          <p>Track your mess and hostel attendance, view trends, and maintain records</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <FontAwesomeIcon icon={faChartLine} />
            <span>{attendanceStats.overall.percentage}% Overall</span>
          </div>
          <div className="stat-badge">
            <FontAwesomeIcon icon={faUtensils} />
            <span>{attendanceStats.mess.percentage}% Mess</span>
          </div>
          <div className="stat-badge">
            <FontAwesomeIcon icon={faHome} />
            <span>{attendanceStats.hostel.percentage}% Hostel</span>
          </div>
        </div>
      </div>

      {/* Attendance Tabs */}
      <div className="attendance-tabs">
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

      {/* Attendance Content */}
      <div className="attendance-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'records' && renderRecordsTab()}
        {activeTab === 'trends' && renderTrendsTab()}
        {activeTab === 'rules' && renderRulesTab()}
      </div>
    </div>
  );
};

export default Attendance;
import React from 'react';
import './StudentDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faHome, 
  faMoneyBill, 
  faCommentDots, 
  faIdCard,
  faCalendarAlt,
  faBell,
  faUtensils,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import useGetQuery from '../../hooks/useGetQuery';
import {useCustom} from "../../context/Store";

const StudentDashboard = () => {
  const {token}=useCustom();
  const {data:studentData}=useGetQuery(`student`,'/api/student/dashboard-details',token);
  console.log(studentData);
  // Pakistani Student Data
  // const studentData = {
  //   name: "Ali Ahmed",
  //   room: "G-104",
  //   department: "Computer Science",
  //   semester: "6th Semester",
  //   university: "NED University",
  //   fees: {
  //     paid: 1500,
  //     total: 6500,
  //     dueDate: "2024-03-15",
  //     currency: "PKR"
  //   },
  //   complaints: 2,
  //   gatePasses: 1,
  //   attendance: "92%"
  // };

  const quickStats = [
    {
      title: "Room Number",
      value: studentData?.student_roll_no,
      icon: faHome,
      color: "#2c5530",
      bgColor: "#e8f5e8"
    },
    {
      title: "Fees Paid",
      value: "0",
      icon: faMoneyBill,
      color: "#1e40af",
      bgColor: "#e0e7ff"
    },
    {
      title: "Pending Complaints",
      value: 0,
      icon: faCommentDots,
      color: "#dc2626",
      bgColor: "#fef2f2"
    },
    {
      title: "Gate Passes",
      value: "0",
      icon: faIdCard,
      color: "#7c3aed",
      bgColor: "#f3e8ff"
    },
    {
      title: "Attendance",
      value: "0",
      icon: faClipboardList,
      color: "#059669",
      bgColor: "#d1fae5"
    },
    {
      title: "Mess Status",
      value: "Active",
      icon: faUtensils,
      color: "#ea580c",
      bgColor: "#fff7ed"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Gate pass approved for weekend",
      time: "2 hours ago",
      type: "success"
    },
    {
      id: 2,
      title: "Complaint registered - AC not working",
      time: "1 day ago",
      type: "warning"
    },
    {
      id: 3,
      title: "Fees payment received",
      time: "3 days ago",
      type: "info"
    },
    {
      id: 4,
      title: "Room inspection completed",
      time: "1 week ago",
      type: "success"
    }
  ];

  return (
    <div className="student-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back, {studentData?.student_name}! 👋</h1>
          <p>Here's your dashboard overview for today - {new Date().toLocaleDateString('en-PK')}</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="stats-grid">
        {quickStats.map((stat, index) => {
          console.log(stat);
          return <div key={index} className="stat-card">
            <div className="stat-icon" style={{ 
              backgroundColor: stat.bgColor,
              color: stat.color 
            }}>
              <FontAwesomeIcon icon={stat.icon} />
            </div>
            <div className="stat-content">
              <h3>{stat?.value}</h3>
              <p>{stat?.title}</p>
            </div>
          </div>
})}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Left Column */}
        <div className="content-column">
          {/* Personal Info Card */}
          <div className="info-card">
            <h3>
              <FontAwesomeIcon icon={faUser} className="card-icon" />
              Student Information
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <p>{studentData?.student_name}</p>
              </div>
              <div className="info-item">
                <label>Room No.</label>
                <p>{studentData?.room_no || "Not Assigned"}</p>
              </div>
              <div className="info-item">
                <label>Department</label>
                <p>{studentData?.department}</p>
              </div>
              <div className="info-item">
                <label>Semester</label>
                <p>{studentData?.semester}</p>
              </div>
              <div className="info-item">
                <label>University</label>
                <p>{studentData?.university}</p>
              </div>
              <div className="info-item">
                <label>Student Status</label>
                <p className="status-active">Active</p>
              </div>
            </div>
          </div>

          {/* Fees Status */}
          <div className="info-card">
            <h3>
              <FontAwesomeIcon icon={faMoneyBill} className="card-icon" />
              Fees Status
            </h3>
            <div className="progress-section">
              <div className="progress-header">
                <span>Payment Progress</span>
                <span>{Math.round((studentData?.totalPaid / studentData?.totalAmount) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(studentData?.totalPaid / studentData?.totalAmount) * 100}%` }}
                ></div>
              </div>
              <div className="fee-details">
                <div className="fee-item">
                  <span>Paid:</span>
                  <strong>Rs. {studentData?.totalPaid?.toLocaleString()}</strong>
                </div>
                <div className="fee-item">
                  <span>Due:</span>
                  <strong className="due-amount">
                    Rs. {(studentData?.balanceDue)?.toLocaleString()}
                  </strong>
                </div>
                <div className="fee-item">
                  <span>Due Date:</span>
                  <span className="due-date">{studentData?.dueDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="content-column">
          {/* Recent Activities */}
          <div className="info-card">
            <h3>
              <FontAwesomeIcon icon={faCalendarAlt} className="card-icon" />
              Recent Activities
            </h3>
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-dot ${activity.type}`}></div>
                  <div className="activity-content">
                    <p>{activity.title}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="info-card">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn primary">Apply Gate Pass</button>
              <button className="action-btn secondary">Raise Complaint</button>
              <button className="action-btn outline">Pay Fees Online</button>
              <button className="action-btn outline">View Time Table</button>
              <button className="action-btn outline">Mess Menu</button>
              <button className="action-btn outline">Request Maintenance</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
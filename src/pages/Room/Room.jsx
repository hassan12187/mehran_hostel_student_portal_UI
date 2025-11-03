import React, { useMemo, useState } from 'react';
import './Room.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,
  faUsers,
  faBed,
  faWifi,
  faSnowflake,
  faTv,
  faChair,
  faShower,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faUser,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faList,
  faTools,
  faFileAlt,
  faCalendarAlt,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import useGetQuery from '../../hooks/useGetQuery';
import { useCustom } from '../../context/Store';

const Room = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {token}=useCustom();

  const {data}=useGetQuery('room','/api/student/room',token);
  const memoizedData=useMemo(()=>data?.data || {},[data]);
  console.log(memoizedData);
  // Room Data
  const roomData = {
    roomNumber: "G-104",
    block: "G-Block",
    floor: "1st Floor",
    type: "Double Sharing",
    status: "Occupied",
    allocationDate: "2023-08-15",
    vacatingDate: "2024-06-30",
    warden: "Mr. Ahmed Raza",
    wardenContact: "+92 300 1234567"
  };

  // Room Amenities
  const amenities = [
    { id: 1, name: "Air Conditioner", icon: faSnowflake, available: true, status: "Working" },
    { id: 2, name: "WiFi", icon: faWifi, available: true, status: "Active" },
    { id: 3, name: "Attached Bathroom", icon: faShower, available: true, status: "Functional" },
    { id: 4, name: "Study Table", icon: faList, available: true, status: "Good" },
    { id: 5, name: "Chair", icon: faChair, available: true, status: "Good" },
    { id: 6, name: "LED TV", icon: faTv, available: false, status: "Not Available" },
    { id: 7, name: "Extra Bed", icon: faBed, available: false, status: "Not Available" },
    { id: 8, name: "Balcony", icon: faHome, available: true, status: "Accessible" }
  ];

  // Roommates Data
  const roommates = [
    {
      id: 1,
      name: "Ali Ahmed",
      studentId: "CS-2021-045",
      department: "Computer Science",
      semester: "6th Semester",
      contact: "+92 300 1234567",
      email: "ali.ahmed@student.edu.pk",
      homeCity: "Karachi",
      emergencyContact: "+92 321 7654321",
      allocationDate: "2023-08-15"
    },
    {
      id: 2,
      name: "Bilal Khan",
      studentId: "EE-2021-078",
      department: "Electrical Engineering",
      semester: "6th Semester",
      contact: "+92 312 9876543",
      email: "bilal.khan@student.edu.pk",
      homeCity: "Lahore",
      emergencyContact: "+92 300 1122334",
      allocationDate: "2023-08-15"
    }
  ];

  // Room Maintenance History
  const maintenanceHistory = [
    {
      id: 1,
      date: "2024-01-15",
      type: "Electrical",
      description: "AC repair and servicing",
      status: "completed",
      assignedTo: "Electrician Team",
      completionDate: "2024-01-16"
    },
    {
      id: 2,
      date: "2024-01-10",
      type: "Plumbing",
      description: "Bathroom tap replacement",
      status: "completed",
      assignedTo: "Plumbing Team",
      completionDate: "2024-01-10"
    },
    {
      id: 3,
      date: "2024-01-18",
      type: "Cleaning",
      description: "Deep cleaning and pest control",
      status: "inProgress",
      assignedTo: "Cleaning Staff",
      completionDate: "Pending"
    },
    {
      id: 4,
      date: "2024-01-20",
      type: "Furniture",
      description: "Study table repair",
      status: "pending",
      assignedTo: "Carpenter",
      completionDate: "Pending"
    }
  ];

  // Hostel Rules
  const hostelRules = [
    {
      category: "General Rules",
      rules: [
        "Strictly maintain silence after 11:00 PM",
        "No visitors allowed in rooms after 8:00 PM",
        "Keep your room clean and tidy at all times",
        "Use of electrical appliances other than provided is prohibited"
      ]
    },
    {
      category: "Safety & Security",
      rules: [
        "Always carry your hostel ID card",
        "Report any suspicious activity to security immediately",
        "No smoking or alcohol consumption in rooms",
        "Fire safety equipment should not be misused"
      ]
    },
    {
      category: "Room Maintenance",
      rules: [
        "Report any maintenance issues within 24 hours",
        "Do not damage hostel property",
        "Regular room inspection will be conducted",
        "Decoration should not damage walls or furniture"
      ]
    }
  ];

  // Room Inspection Schedule
  const inspectionSchedule = [
    {
      id: 1,
      date: "2024-02-01",
      time: "10:00 AM",
      type: "Monthly Inspection",
      conductedBy: "Warden Office",
      status: "upcoming"
    },
    {
      id: 2,
      date: "2024-01-15",
      time: "11:00 AM",
      type: "Random Check",
      conductedBy: "Chief Warden",
      status: "completed"
    },
    {
      id: 3,
      date: "2024-01-01",
      time: "09:30 AM",
      type: "Monthly Inspection",
      conductedBy: "Warden Office",
      status: "completed"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Room Overview', icon: faHome },
    { id: 'roommates', label: 'Roommates', icon: faUsers },
    { id: 'maintenance', label: 'Maintenance', icon: faTools },
    { id: 'rules', label: 'Hostel Rules', icon: faFileAlt }
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { icon: faCheckCircle, color: '#10b981', label: 'Completed' };
      case 'inProgress':
        return { icon: faClock, color: '#f59e0b', label: 'In Progress' };
      case 'pending':
        return { icon: faClock, color: '#6b7280', label: 'Pending' };
      case 'upcoming':
        return { icon: faClock, color: '#3b82f6', label: 'Upcoming' };
      default:
        return { icon: faClock, color: '#6b7280', label: 'Pending' };
    }
  };

  const renderOverviewTab = () => (
    <div className="overview-tab">
      {/* Room Basic Info */}
      <div className="room-basic-info">
        <div className="room-header">
          <div className="room-title">
            <h2>Room {memoizedData?.room?.room_no}</h2>
            <span className="room-type">{roomData.type}</span>
          </div>
          <div className="room-status">
            <div className={`status-badge ${roomData.status.toLowerCase()}`}>
              {roomData.status}
            </div>
          </div>
        </div>

        <div className="room-details-grid">
          <div className="detail-item p-2">
            <FontAwesomeIcon icon={faHome} className="detail-icon" />
            <div className="detail-content">
              <label>Block</label>
              <span>{memoizedData?.room?.block?.block_no}</span>
            </div>
          </div>
          <div className="detail-item p-2">
            <FontAwesomeIcon icon={faHome} className="detail-icon" />
            <div className="detail-content">
              <label>Floor</label>
              <span>{roomData.floor}</span>
            </div>
          </div>
          <div className="detail-item p-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
            <div className="detail-content">
              <label>Allocation Date</label>
              <span>{roomData.allocationDate}</span>
            </div>
          </div>
          <div className="detail-item p-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
            <div className="detail-content">
              <label>Vacating Date</label>
              <span>{roomData.vacatingDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Amenities */}
      <div className="amenities-section">
        <h3>Room Amenities</h3>
        <div className="amenities-grid">
          {amenities.map(amenity => (
            <div key={amenity.id} className={`amenity-card ${amenity.available ? 'available' : 'not-available'}`}>
              <div className="amenity-icon">
                <FontAwesomeIcon icon={amenity.icon} />
              </div>
              <div className="amenity-info">
                <h4>{amenity.name}</h4>
                <span className={`status ${amenity.available ? 'available' : 'not-available'}`}>
                  {amenity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warden Information */}
      <div className="warden-section">
        <h3>Warden Information</h3>
        <div className="warden-card">
          <div className="warden-avatar">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="warden-details">
            <h4>{roomData.warden}</h4>
            <p>Block Warden - {roomData.block}</p>
            <div className="warden-contact">
              <div className="contact-item">
                <FontAwesomeIcon icon={faPhone} />
                <span>{roomData.wardenContact}</span>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>Warden Office, {roomData.block}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn primary">
            <FontAwesomeIcon icon={faTools} />
            Request Maintenance
          </button>
          <button className="action-btn outline">
            <FontAwesomeIcon icon={faFileAlt} />
            Room Change Request
          </button>
          <button className="action-btn outline">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );

  const renderRoommatesTab = () => (
    <div className="roommates-tab">
      <div className="roommates-header">
        <h3>Roommates</h3>
        <div className="roommates-count">
          <span>{memoizedData?.room?.occupants_info?.length} Roommates</span>
        </div>
      </div>

      <div className="roommates-grid">
        {memoizedData?.room?.occupants_info?.map(roommate => (
          <div key={roommate._id} className="roommate-card">
            <div className="roommate-header">
              <div className="roommate-avatar">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="roommate-basic-info">
                <h4>{roommate.student_name}</h4>
                <p>{roommate.department || "Department"} • {roommate.semester || "Semester"}</p>
                <span className="student-id">Student ID: {roommate.student_roll_no || "Student ID"}</span>
              </div>
            </div>

            <div className="roommate-details">
              <div className="detail-row">
                <div className="detail-item p-2">
                  <strong>Contact:</strong>
                  <span>{roommate.student_cellphone}</span>
                </div>
                <div className="detail-item p-2">
                  <strong>Email:</strong>
                  <span>{roommate.student_email}</span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-item p-2">
                  <strong>Home City:</strong>
                  <span>{roommate.city}</span>
                </div>
                <div className="detail-item p-2">
                  <strong>Allocated Since:</strong>
                  <span>{roommate.allocationDate}</span>
                </div>
              </div>
              <div className="detail-item p-2 full-width">
                <strong>Emergency Contact:</strong>
                <span>{roommate.student_cellphone}</span>
              </div>
            </div>

            <div className="roommate-actions">
              <button className="btn btn-outline small">
                <FontAwesomeIcon icon={faPhone} />
                Call
              </button>
              <button className="btn btn-outline small">
                <FontAwesomeIcon icon={faEnvelope} />
                Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty Bed Info */}
      <div className="empty-bed-info">
        <div className="empty-bed-card">
          <FontAwesomeIcon icon={faBed} className="empty-bed-icon" />
          <div className="empty-bed-content">
            <h4>No Empty Beds</h4>
            <p>All beds in this room are currently occupied.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceTab = () => (
    <div className="maintenance-tab">
      <div className="maintenance-header">
        <h3>Maintenance History</h3>
        <button className="btn btn-primary">
          <FontAwesomeIcon icon={faTools} />
          New Maintenance Request
        </button>
      </div>

      {/* Current Issues */}
      <div className="current-issues">
        <h4>Current Issues</h4>
        <div className="issues-list">
          {maintenanceHistory
            .filter(item => item.status !== 'completed')
            .map(item => {
              const statusInfo = getStatusInfo(item.status);
              
              return (
                <div key={item.id} className="issue-card">
                  <div className="issue-header">
                    <div className="issue-type">
                      <span className={`type-badge ${item.type.toLowerCase()}`}>
                        {item.type}
                      </span>
                      <span className="issue-date">{item.date}</span>
                    </div>
                    <div className="issue-status" style={{ color: statusInfo.color }}>
                      <FontAwesomeIcon icon={statusInfo.icon} />
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>
                  
                  <div className="issue-description">
                    <p>{item.description}</p>
                  </div>

                  <div className="issue-details">
                    <div className="detail-item">
                      <strong>Assigned To:</strong>
                      <span>{item.assignedTo}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Expected Completion:</strong>
                      <span>{item.completionDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Maintenance History */}
      <div className="maintenance-history">
        <h4>Recent Maintenance History</h4>
        <div className="history-table">
          <div className="table-header">
            <span>Date</span>
            <span>Type</span>
            <span>Description</span>
            <span>Status</span>
          </div>
          {maintenanceHistory
            .filter(item => item.status === 'completed')
            .map(item => (
              <div key={item.id} className="table-row">
                <span>{item.date}</span>
                <span>
                  <span className={`type-badge small ${item.type.toLowerCase()}`}>
                    {item.type}
                  </span>
                </span>
                <span className="description">{item.description}</span>
                <span>
                  <div className="status-badge completed">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Completed
                  </div>
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Inspection Schedule */}
      <div className="inspection-schedule">
        <h4>Room Inspection Schedule</h4>
        <div className="inspections-list">
          {inspectionSchedule.map(inspection => {
            const statusInfo = getStatusInfo(inspection.status);
            
            return (
              <div key={inspection.id} className="inspection-card">
                <div className="inspection-header">
                  <div className="inspection-info">
                    <h5>{inspection.type}</h5>
                    <span className="inspection-date">{inspection.date} at {inspection.time}</span>
                  </div>
                  <div className="inspection-status" style={{ color: statusInfo.color }}>
                    <FontAwesomeIcon icon={statusInfo.icon} />
                    <span>{statusInfo.label}</span>
                  </div>
                </div>
                
                <div className="inspection-details">
                  <div className="detail-item">
                    <strong>Conducted By:</strong>
                    <span>{inspection.conductedBy}</span>
                  </div>
                </div>

                {inspection.status === 'upcoming' && (
                  <div className="inspection-reminder">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span>Please ensure room is clean and tidy before inspection</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderRulesTab = () => (
    <div className="rules-tab">
      <div className="rules-header">
        <h3>Hostel Rules & Regulations</h3>
        <p>Please read and follow all hostel rules carefully</p>
      </div>

      <div className="rules-categories">
        {hostelRules.map((category, index) => (
          <div key={index} className="rules-category">
            <h4>{category.category}</h4>
            <div className="rules-list">
              {category.rules.map((rule, ruleIndex) => (
                <div key={ruleIndex} className="rule-item">
                  <FontAwesomeIcon icon={faList} className="rule-icon" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="important-notices">
        <div className="notice-card important">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <div className="notice-content">
            <h5>Important Notices</h5>
            <ul>
              <li>Violation of rules may lead to disciplinary action</li>
              <li>Repeated offenses can result in hostel suspension</li>
              <li>Always keep your valuable items locked</li>
              <li>Report any security concerns immediately</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rules-acknowledgement">
        <div className="ack-card">
          <FontAwesomeIcon icon={faCheckCircle} />
          <div className="ack-content">
            <h5>Rules Acknowledgement</h5>
            <p>By staying in the hostel, you agree to abide by all the rules and regulations mentioned above.</p>
            <div className="ack-status">
              <span className="status-badge completed">Acknowledged on: 2023-08-15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="room-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FontAwesomeIcon icon={faHome} />
            Room Details
          </h1>
          <p>Manage your room information, roommates, and maintenance requests</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <FontAwesomeIcon icon={faUsers} />
            <span>{roommates.length} Roommates</span>
          </div>
          <div className="stat-badge">
            <FontAwesomeIcon icon={faHome} />
            <span>Room {roomData.roomNumber}</span>
          </div>
        </div>
      </div>

      {/* Room Tabs */}
      <div className="room-tabs">
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

      {/* Room Content */}
      <div className="room-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'roommates' && renderRoommatesTab()}
        {activeTab === 'maintenance' && renderMaintenanceTab()}
        {activeTab === 'rules' && renderRulesTab()}
      </div>
    </div>
  );
};

export default Room;
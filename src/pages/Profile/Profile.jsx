import React, { useMemo, useState } from 'react';
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faCalendarAlt,
  faIdCard,
  faEdit,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import useGetQuery from '../../hooks/useGetQuery';
import { useCustom } from '../../context/Store';

const Profile = () => {
  const {token}=useCustom();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const {data}=useGetQuery('student_details','/api/student/details',token);
  const memoizedData=useMemo(()=>data?.data || {},[data])
  console.log(memoizedData);
  // Student Data
  const [studentData, setStudentData] = useState({
    personalInfo: {
      fullName: "Ali Ahmed",
      studentId: "CS-2021-045",
      cnic: "42201-1234567-8",
      dateOfBirth: "2000-05-15",
      gender: "Male",
      bloodGroup: "B+"
    },
    contactInfo: {
      email: "ali.ahmed@student.edu.pk",
      phone: "+92 300 1234567",
      emergencyContact: "+92 321 7654321",
      address: "Hostel G-Block, Room 104, University Campus, Karachi",
      permanentAddress: "House No. 123, Gulshan-e-Iqbal, Karachi"
    },
    academicInfo: {
      department: "Computer Science",
      semester: "6th Semester",
      batch: "2021-2025",
      rollNumber: "CS-045",
      cgpa: "3.45",
      university: "NED University of Engineering & Technology"
    }
  });

  const [editData, setEditData] = useState(studentData);

  const handleEdit = () => {
    setEditData(studentData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setStudentData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(studentData);
    setIsEditing(false);
  };

  const handleChange = (section, field, value) => {
    setEditData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: faUser },
    { id: 'contact', label: 'Contact Info', icon: faEnvelope },
    { id: 'academic', label: 'Academic Info', icon: faIdCard }
  ];

  const renderPersonalInfo = () => (
    <div className="info-section">
      <div className="info-grid">
        <div className="info-item">
          <label>Full Name</label>
          {isEditing ? (
            <input
              type="text"
              value={memoizedData?.data}
              onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)}
              className="edit-input"
            />
          ) : (
            <p>{memoizedData?.student_name}</p>
          )}
        </div>

        <div className="info-item">
          <label>Student ID</label>
          <p className="read-only">{studentData.personalInfo.studentId}</p>
        </div>

        <div className="info-item">
          <label>CNIC</label>
          {isEditing ? (
            <input
              type="text"
              value={editData.personalInfo.cnic}
              onChange={(e) => handleChange('personalInfo', 'cnic', e.target.value)}
              className="edit-input"
              placeholder="XXXXX-XXXXXXX-X"
            />
          ) : (
            <p>{memoizedData?.cnic_no}</p>
          )}
        </div>

        <div className="info-item">
          <label>Date of Birth</label>
          {isEditing ? (
            <input
              type="date"
              value={editData.personalInfo.dateOfBirth}
              onChange={(e) => handleChange('personalInfo', 'dateOfBirth', e.target.value)}
              className="edit-input"
            />
          ) : (
            <p>{memoizedData?.date_of_birth}</p>
          )}
        </div>

        <div className="info-item">
          <label>Gender</label>
          {isEditing ? (
            <select
              value={editData.personalInfo.gender}
              onChange={(e) => handleChange('personalInfo', 'gender', e.target.value)}
              className="edit-input"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p>{memoizedData?.gender}</p>
          )}
        </div>

        <div className="info-item">
          <label>Blood Group</label>
          {isEditing ? (
            <select
              value={editData.personalInfo.bloodGroup}
              onChange={(e) => handleChange('personalInfo', 'bloodGroup', e.target.value)}
              className="edit-input"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          ) : (
            <p>{studentData.personalInfo.bloodGroup}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="info-section">
      <div className="info-grid">
        <div className="info-item">
          <label>
            <FontAwesomeIcon icon={faEnvelope} className="field-icon" />
            Email Address
          </label>
          {isEditing ? (
            <input
              type="email"
              value={editData.contactInfo.email}
              onChange={(e) => handleChange('contactInfo', 'email', e.target.value)}
              className="edit-input"
            />
          ) : (
            <p>{memoizedData?.student_email}</p>
          )}
        </div>

        <div className="info-item">
          <label>
            <FontAwesomeIcon icon={faPhone} className="field-icon" />
            Phone Number
          </label>
          {isEditing ? (
            <input
              type="tel"
              value={editData.contactInfo.phone}
              onChange={(e) => handleChange('contactInfo', 'phone', e.target.value)}
              className="edit-input"
            />
          ) : (
            <p>{memoizedData?.student_cellphone}</p>
          )}
        </div>

        <div className="info-item">
          <label>
            <FontAwesomeIcon icon={faPhone} className="field-icon" />
            Emergency Contact
          </label>
          {isEditing ? (
            <input
              type="tel"
              value={editData.contactInfo.emergencyContact}
              onChange={(e) => handleChange('contactInfo', 'emergencyContact', e.target.value)}
              className="edit-input"
            />
          ) : (
            <p>{memoizedData?.student_cellphone}</p>
          )}
        </div>

        <div className="info-item full-width">
          <label>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="field-icon" />
            Current Address (Hostel)
          </label>
          {isEditing ? (
            <textarea
              value={editData.contactInfo.address}
              onChange={(e) => handleChange('contactInfo', 'address', e.target.value)}
              className="edit-input textarea"
              rows="3"
            />
          ) : (
            <p>{memoizedData?.postal_address}</p>
          )}
        </div>

        <div className="info-item full-width">
          <label>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="field-icon" />
            Permanent Address
          </label>
          {isEditing ? (
            <textarea
              value={editData.contactInfo.permanentAddress}
              onChange={(e) => handleChange('contactInfo', 'permanentAddress', e.target.value)}
              className="edit-input textarea"
              rows="3"
            />
          ) : (
            <p>{memoizedData?.permanent_address}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderAcademicInfo = () => (
    <div className="info-section">
      <div className="info-grid">
        <div className="info-item">
          <label>Department</label>
          <p className="read-only">{studentData.academicInfo.department}</p>
        </div>

        <div className="info-item">
          <label>Semester</label>
          <p className="read-only">{studentData.academicInfo.semester}</p>
        </div>

        <div className="info-item">
          <label>Batch</label>
          <p className="read-only">{studentData.academicInfo.batch}</p>
        </div>

        <div className="info-item">
          <label>Roll Number</label>
          <p className="read-only">{studentData.academicInfo.rollNumber}</p>
        </div>

        <div className="info-item">
          <label>CGPA</label>
          <p className="read-only">{studentData.academicInfo.cgpa}</p>
        </div>

        <div className="info-item full-width">
          <label>University</label>
          <p className="read-only">{studentData.academicInfo.university}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="avatar-status"></div>
        </div>
        
        <div className="profile-info">
          <h1>{memoizedData?.student_name}</h1>
          <p>{studentData.academicInfo.department} • {studentData.academicInfo.semester}</p>
          <div className="student-badges">
            <span className="badge primary">Active</span>
            <span className="badge secondary">Hostel Resident</span>
            <span className="badge success">Fee Paid</span>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <div className="edit-actions">
              <button className="btn btn-success" onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} />
                Save Changes
              </button>
              <button className="btn btn-outline" onClick={handleCancel}>
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleEdit}>
              <FontAwesomeIcon icon={faEdit} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs">
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

      {/* Profile Content */}
      <div className="profile-content">
        <div className="content-card">
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'contact' && renderContactInfo()}
          {activeTab === 'academic' && renderAcademicInfo()}
        </div>

        {/* Quick Stats Sidebar */}
        <div className="profile-sidebar">
          <div className="sidebar-card">
            <h3>Quick Stats</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Room No.</span>
                <span className="stat-value">{memoizedData?.room?.room_no}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Attendance</span>
                <span className="stat-value success">92%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Complaints</span>
                <span className="stat-value warning">{memoizedData?.complaints.length} Pending</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Gate Pass</span>
                <span className="stat-value info">1 Active</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Emergency Contacts</h3>
            <div className="emergency-contacts">
              <div className="contact-item">
                <strong>Warden Office</strong>
                <span>+92 21 1234567</span>
              </div>
              <div className="contact-item">
                <strong>Security</strong>
                <span>+92 300 9876543</span>
              </div>
              <div className="contact-item">
                <strong>Medical Center</strong>
                <span>+92 21 7654321</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
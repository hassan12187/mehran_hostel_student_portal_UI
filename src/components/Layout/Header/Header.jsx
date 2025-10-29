import React, { useState } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faBars, faCog, faLock, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Header = ({ toggleSidebar, userData, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const user = userData || {
    name: "Ali Ahmed",
    email: "ali.ahmed@student.edu.pk",
    role: "Student"
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="logo">
          <h2>Hostel Management System</h2>
        </div>
      </div>

      <div className="header-right">
        <div className="notification-icon">
          <FontAwesomeIcon icon={faBell} />
          <span className="notification-badge">3</span>
        </div>
        
        <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="user-avatar">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>

          {showDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-avatar">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="dropdown-user-info">
                  <span className="dropdown-name">{user.name}</span>
                  <span className="dropdown-email">{user.email}</span>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <button className="dropdown-item" onClick={() => {/* Profile page pe navigate karo */}}>
                <FontAwesomeIcon icon={faUser} />
                <span>My Profile</span>
              </button>
              
              <button className="dropdown-item" onClick={() => {/* Settings page pe navigate karo */}}>
                <FontAwesomeIcon icon={faCog} />
                <span>Settings</span>
              </button>
              
              <button className="dropdown-item" onClick={() => {/* Change password functionality */}}>
                <FontAwesomeIcon icon={faLock} />
                <span>Change Password</span>
              </button>
              
              <div className="dropdown-divider"></div>
              
              <button className="dropdown-item logout" onClick={onLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
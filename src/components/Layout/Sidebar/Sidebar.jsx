import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUser,
  faHome,
  faMoneyBill,
  faCommentDots,
  faIdCard,
  faCalendarCheck,
  faUtensils,
  faBullhorn,
  faUsers,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen,  onLogout }) => {
  const location = useLocation();
  const menuItems = [
    { id: '/', label: 'Dashboard', icon: faTachometerAlt },
    { id: '/profile', label: 'Profile', icon: faUser },
    { id: '/room', label: 'Room Details', icon: faHome },
    { id: '/fees', label: 'Fees', icon: faMoneyBill },
    { id: '/complaints', label: 'Complaints', icon: faCommentDots },
    { id: '/gatepass', label: 'Gate Pass', icon: faIdCard },
    { id: '/attendance', label: 'Attendance', icon: faCalendarCheck },
    { id: '/mess', label: 'Mess', icon: faUtensils },
    { id: '/notices', label: 'Notices', icon: faBullhorn },
    { id: '/visitors', label: 'Visitors', icon: faUsers },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon"></div>
            <span className="logo-text">Hostel Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <NavLink to={item.id} key={item.id}>
                <button
                  className={`nav-item ${location.pathname === item.id ? 'active' : ''}`}
                >
                  <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </button>
              </NavLink>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
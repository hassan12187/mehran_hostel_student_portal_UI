import React, { useState } from 'react';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import './Layout.css';
import { Outlet } from 'react-router-dom';
import { useCustom } from '../../context/Store';

const Layout = ({ userData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {logout}=useCustom();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // Logout logic yahan aayegi
    console.log('Logging out...');
    logout();
  };

  return (
    <div className="layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        onLogout={handleLogout}
      />
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header 
          toggleSidebar={toggleSidebar} 
          userData={userData}
          onLogout={handleLogout}
        />
        
        <main className="content-area">
          {/* {children} */}
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default Layout;
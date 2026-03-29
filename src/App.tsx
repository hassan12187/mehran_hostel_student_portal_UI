import React, { useState } from 'react';
import Layout from './components/Layout/Layout.jsx';
import StudentDashboard from './pages/Dashboard/StudentDashboard.js';
import Profile from './pages/Profile/Profile.js';
import Fees from './pages/Fees/Fees.js';
import Complaints from './pages/Complaints/Complaints.js';
import Gatepass from './pages/Gatepass/Gatepass.jsx';
import Mess from './pages/Mess/Mess.js';
import Room from './pages/Room/Room.jsx';
import Visitors from './pages/Visitors/Visitors.jsx';
import Attendance from './pages/Attendance/Attendance.js';
import Notices from './pages/Notices/Notices.jsx';
// import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CheckAuth from './components/Reusable/CheckAuth.jsx';
// import Login from './pages/Auth/Login/Login.jsx';
import Login from './pages/Auth/Login/Login.js';
import ChangePassword from './pages/changepassword/ChangePassword.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword.jsx';

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Sample user data
  const userData = {
    name: "Ali Ahmed",
    studentId: "CS-2021-045",
    room: "G-104",
    department: "Computer Science",
    email: "ali.ahmed@student.edu.pk",
    role: "Student"
  };

  // const renderCurrentPage = () => {
  //   switch (currentPage) {
  //     case 'dashboard':
  //       return <StudentDashboard />;
  //     case 'profile':
  //       return <Profile />;
  //     case 'fees':
  //       return <Fees />;
  //     case 'complaints':
  //       return <Complaints />;
  //     case 'gatepass':
  //       return <Gatepass />;
  //     case 'mess':
  //       return <Mess />;
  //     case 'room':
  //       return <Room />;
  //     case 'visitors':
  //       return <Visitors />;
  //     case 'attendance':
  //       return <Attendance />;
  //     case 'notices':
  //       return <Notices />;
  //     default:
  //       return <StudentDashboard />;
  //   }
  // };
const router=createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    errorElement:<h1>No Page Found</h1>,
    children:[
{
    path:"/",
    element:<CheckAuth> <StudentDashboard/></CheckAuth>
  },
  {path:"/profile",
    element:<CheckAuth> <Profile/></CheckAuth>
  },
  {
    path:"/invoices",
    element:<CheckAuth> <Fees/></CheckAuth>
  },
  {
    path:"/complaints",
    element:<CheckAuth> <Complaints/></CheckAuth>
  },
  {
    path:"/gatepass",
    element:<CheckAuth> <Gatepass/></CheckAuth>
  },
  {
    path:"/mess",
    element:<CheckAuth> <Mess/></CheckAuth>
  },
  {
    path:"/room",
    element:<CheckAuth> <Room/></CheckAuth>
  },
  {
    path:"/visitors",
    element:<CheckAuth> <Visitors/></CheckAuth>
  },
  
  {
    path:"/attendance",
    element:<CheckAuth> <Attendance/></CheckAuth>
  },
  // {
  //   path:"/notices",
  //   element:<CheckAuth> <Notices/></CheckAuth>
  // }
    ]
   
  },
   {
      path:"/login",
      element:<Login />
    },
    {
    path:"/change-password",
    element:<CheckAuth>
      <ChangePassword/>
    </CheckAuth>
  },
  {
    path:"/forgot-password",
    element:<ForgotPassword />
  }
])
  return (
    <div className="App">
      {/* <Layout 
        // currentPage={currentPage} 
        // setCurrentPage={setCurrentPage}
        userData={userData}
      >
        {renderCurrentPage()}
      </Layout> */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
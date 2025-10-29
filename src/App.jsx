import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import Profile from './pages/Profile/Profile';
import Fees from './pages/Fees/Fees';
import Complaints from './pages/Complaints/Complaints';
import Gatepass from './pages/Gatepass/Gatepass';
import Mess from './pages/Mess/Mess';
import Room from './pages/Room/Room';
import Visitors from './pages/Visitors/Visitors';
import Attendance from './pages/Attendance/Attendance';
import Notices from './pages/Notices/Notices';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CheckAuth from './components/Reusable/CheckAuth';

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
    children:[
{
    path:"/",
    element:<CheckAuth> <StudentDashboard/></CheckAuth>
  },
  {path:"/profile",
    element:<CheckAuth> <Profile/></CheckAuth>
  },
  {
    path:"/fees",
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
  {
    path:"/notices",
    element:<CheckAuth> <Notices/></CheckAuth>
  }
    ]
   
  },
   {
      path:"/login",
      element:<h1>Login Page</h1>
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
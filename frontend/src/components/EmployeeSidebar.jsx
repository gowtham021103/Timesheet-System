import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const EmployeeSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="icon">⏱️</span>
        TimeSync
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/employee-dashboard" end className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
        <NavLink to="/employee-dashboard/projects" className={({ isActive }) => isActive ? "active" : ""}>My Projects</NavLink>
        <NavLink to="/employee-dashboard/tasks" className={({ isActive }) => isActive ? "active" : ""}>My Tasks</NavLink>
        <NavLink to="/employee-dashboard/submit-timesheet" className={({ isActive }) => isActive ? "active" : ""}>Submit Timesheet</NavLink>
        <NavLink to="/employee-dashboard/timesheet-history" className={({ isActive }) => isActive ? "active" : ""}>Timesheet History</NavLink>
        <NavLink to="/employee-dashboard/progress" className={({ isActive }) => isActive ? "active" : ""}>Project Progress</NavLink>
        <NavLink to="/employee-dashboard/messages" className={({ isActive }) => isActive ? "active" : ""}>Messages</NavLink>
        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
      </nav>
    </aside>
  );
};

export default EmployeeSidebar;

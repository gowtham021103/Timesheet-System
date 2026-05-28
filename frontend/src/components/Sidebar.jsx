import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Admin System</div>
      <nav className="sidebar-nav">
        <NavLink to="/admin-dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/admin-dashboard/users" className={({ isActive }) => isActive ? 'active' : ''}>
          User Management
        </NavLink>
        <NavLink to="/admin-dashboard/projects" className={({ isActive }) => isActive ? 'active' : ''}>
          Project Management
        </NavLink>
        <NavLink to="/admin-dashboard/teams" className={({ isActive }) => isActive ? 'active' : ''}>
          Team Structure
        </NavLink>
        <NavLink to="/admin-dashboard/timesheets" className={({ isActive }) => isActive ? 'active' : ''}>
          Timesheet Monitoring
        </NavLink>
        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
          Logout
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;

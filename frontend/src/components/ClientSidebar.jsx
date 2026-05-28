import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const ClientSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Client Portal</div>
      <nav className="sidebar-nav">
        <NavLink to="/client-dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/client-dashboard/my-projects" className={({ isActive }) => isActive ? 'active' : ''}>
          My Projects
        </NavLink>
        <NavLink to="/client-dashboard/project-progress" className={({ isActive }) => isActive ? 'active' : ''}>
          Project Progress
        </NavLink>
        <NavLink to="/client-dashboard/team-members" className={({ isActive }) => isActive ? 'active' : ''}>
          Team Members
        </NavLink>
        <NavLink to="/client-dashboard/timesheet-activity" className={({ isActive }) => isActive ? 'active' : ''}>
          Timesheet Activity
        </NavLink>
        <NavLink to="/client-dashboard/feedback" className={({ isActive }) => isActive ? 'active' : ''}>
          Feedback & Approvals
        </NavLink>
        <NavLink to="/client-dashboard/reports" className={({ isActive }) => isActive ? 'active' : ''}>
          Reports
        </NavLink>
        <NavLink to="/client-dashboard/messages" className={({ isActive }) => isActive ? 'active' : ''}>
          Messages
        </NavLink>
        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
          Logout
        </a>
      </nav>
    </aside>
  );
};

export default ClientSidebar;

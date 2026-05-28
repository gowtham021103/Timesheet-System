import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const ManagerSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Manager Portal</div>
      <nav className="sidebar-nav">
        <NavLink to="/manager-dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/manager-dashboard/assigned-projects" className={({ isActive }) => isActive ? 'active' : ''}>
          Assigned Projects
        </NavLink>
        <NavLink to="/manager-dashboard/team-leads" className={({ isActive }) => isActive ? 'active' : ''}>
          Team Leads
        </NavLink>
        <NavLink to="/manager-dashboard/employees" className={({ isActive }) => isActive ? 'active' : ''}>
          Employees
        </NavLink>
        <NavLink to="/manager-dashboard/project-progress" className={({ isActive }) => isActive ? 'active' : ''}>
          Project Progress
        </NavLink>
        <NavLink to="/manager-dashboard/timesheets" className={({ isActive }) => isActive ? 'active' : ''}>
          Timesheets
        </NavLink>
        <NavLink to="/manager-dashboard/reports" className={({ isActive }) => isActive ? 'active' : ''}>
          Reports
        </NavLink>
        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
          Logout
        </a>
      </nav>
    </aside>
  );
};

export default ManagerSidebar;

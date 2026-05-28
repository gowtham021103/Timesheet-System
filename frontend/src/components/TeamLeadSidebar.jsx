import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const TeamLeadSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">Team Lead Hub</div>
            <nav className="sidebar-nav">
                <NavLink to="/teamlead-dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
                    Dashboard
                </NavLink>
                <NavLink to="/teamlead-dashboard/assigned-projects" className={({ isActive }) => isActive ? 'active' : ''}>
                    Assigned Projects
                </NavLink>
                <NavLink to="/teamlead-dashboard/task-management" className={({ isActive }) => isActive ? 'active' : ''}>
                    Task Management
                </NavLink>
                <NavLink to="/teamlead-dashboard/team-members" className={({ isActive }) => isActive ? 'active' : ''}>
                    Team Members
                </NavLink>
                <NavLink to="/teamlead-dashboard/timesheets" className={({ isActive }) => isActive ? 'active' : ''}>
                    Timesheets
                </NavLink>
                <NavLink to="/teamlead-dashboard/reports" className={({ isActive }) => isActive ? 'active' : ''}>
                    Reports
                </NavLink>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    Logout
                </a>
            </nav>
        </aside>
    );
};

export default TeamLeadSidebar;

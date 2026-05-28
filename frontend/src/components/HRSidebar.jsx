import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const HRSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-logo">Timesheet Pro</div>
            <nav className="sidebar-nav">
                <NavLink to="/hr-dashboard" end className={({ isActive }) => isActive ? "active" : ""}>
                    Dashboard
                </NavLink>
                <NavLink to="/hr-dashboard/employees" className={({ isActive }) => isActive ? "active" : ""}>
                    Employee Management
                </NavLink>
                <NavLink to="/hr-dashboard/attendance" className={({ isActive }) => isActive ? "active" : ""}>
                    Attendance
                </NavLink>
                <NavLink to="/hr-dashboard/payroll" className={({ isActive }) => isActive ? "active" : ""}>
                    Payroll
                </NavLink>
                <NavLink to="/hr-dashboard/timesheets" className={({ isActive }) => isActive ? "active" : ""}>
                    Timesheet Monitoring
                </NavLink>
                <NavLink to="/hr-dashboard/reports" className={({ isActive }) => isActive ? "active" : ""}>
                    Reports
                </NavLink>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    Logout
                </a>
            </nav>
        </div>
    );
};

export default HRSidebar;

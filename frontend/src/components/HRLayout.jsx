import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import HRSidebar from './HRSidebar';
import '../styles/hrDashboard.css';

const HRLayout = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    useEffect(() => {
        if (role !== 'hr') {
            navigate('/');
        }
    }, [role, navigate]);

    return (
        <div className="hr-dashboard-container">
            <HRSidebar />
            <main className="hr-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default HRLayout;

import React, { useState, useEffect } from 'react';
import ManagerLayout from '../components/ManagerLayout';
import axios from 'axios';

const ManagerDashboardMain = () => {
    const [stats, setStats] = useState({
        total_projects: 0,
        active_projects: 0,
        team_leads: 0,
        employees: 0,
        pending_timesheets: 0,
        completion_rate: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('id');
            const token = localStorage.getItem('token') || '';
            try {
                const res = await axios.get(`http://127.0.0.1:8001/api/manager/dashboard/?user_id=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching manager stats:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <ManagerLayout title="Manager Dashboard">
            <div className="welcome-banner" style={{ marginBottom: '32px' }}>
                <h1 style={{ color: '#1a237e', marginBottom: '8px' }}>Welcome Manager</h1>
                <p style={{ color: '#666' }}>You can manage projects and monitor team performance from this dashboard.</p>
            </div>

            <div className="manager-stats-grid">
                <div className="manager-stat-card">
                    <h3>Total Assigned Projects</h3>
                    <p>{stats.total_projects}</p>
                </div>
                <div className="manager-stat-card">
                    <h3>Active Projects</h3>
                    <p>{stats.active_projects}</p>
                </div>
                <div className="manager-stat-card">
                    <h3>Team Leads</h3>
                    <p>{stats.team_leads}</p>
                </div>
                <div className="manager-stat-card">
                    <h3>Employees</h3>
                    <p>{stats.employees}</p>
                </div>
                <div className="manager-stat-card">
                    <h3>Pending Timesheets</h3>
                    <p>{stats.pending_timesheets}</p>
                </div>
                <div className="manager-stat-card">
                    <h3>Project Completion Rate</h3>
                    <p>{stats.completion_rate}%</p>
                </div>
            </div>
        </ManagerLayout>
    );
};

export default ManagerDashboardMain;

import React, { useState, useEffect } from 'react';
import TeamLeadLayout from '../components/TeamLeadLayout';
import axios from 'axios';

const TeamLeadDashboardMain = () => {
    const [stats, setStats] = useState({
        total_projects: 0,
        employees: 0,
        pending_timesheets: 0,
        completed_tasks: 0,
        completion_rate: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('id');
            const token = localStorage.getItem('token') || '';
            try {
                const res = await axios.get(`http://127.0.0.1:8001/api/teamlead/dashboard/?user_id=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching team lead stats:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <TeamLeadLayout title="Dashboard Overview">
            <div className="teamlead-stats-grid">
                <div className="teamlead-stat-card">
                    <h3>Total Assigned Projects</h3>
                    <p>{stats.total_projects}</p>
                </div>
                <div className="teamlead-stat-card">
                    <h3>Total Employees in Team</h3>
                    <p>{stats.employees}</p>
                </div>
                <div className="teamlead-stat-card">
                    <h3>Pending Timesheets</h3>
                    <p>{stats.pending_timesheets}</p>
                </div>
                <div className="teamlead-stat-card">
                    <h3>Completed Tasks</h3>
                    <p>{stats.completed_tasks}</p>
                </div>
                <div className="teamlead-stat-card">
                    <h3>Project Completion Rate</h3>
                    <p>{stats.completion_rate}%</p>
                </div>
            </div>
        </TeamLeadLayout>
    );
};

export default TeamLeadDashboardMain;

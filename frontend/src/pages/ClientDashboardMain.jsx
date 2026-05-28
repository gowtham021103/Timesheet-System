import React, { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import axios from 'axios';

const ClientDashboardMain = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        completedTasks: 0,
        totalHours: 0,
        progress: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            const role = localStorage.getItem('role');
            const userId = localStorage.getItem('id');
            try {
                const projects = await axios.get(`http://127.0.0.1:8001/api/projects/?role=${role}&user_id=${userId}`);
                const timesheets = await axios.get(`http://127.0.0.1:8001/api/timesheets/?role=${role}&user_id=${userId}`);
                
                const active = projects.data.filter(p => p.status === 'Active').length;
                const totalHours = timesheets.data.reduce((sum, t) => sum + parseFloat(t.hours), 0);
                const avgProgress = projects.data.length > 0 
                  ? projects.data.reduce((sum, p) => sum + p.progress, 0) / projects.data.length 
                  : 0;

                setStats({
                    totalProjects: projects.data.length,
                    activeProjects: active,
                    completedTasks: 12, // Dummy for now
                    totalHours: totalHours.toFixed(1),
                    progress: Math.round(avgProgress)
                });
            } catch (err) {
                console.error("Error fetching client stats:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <ClientLayout title="Dashboard Overview">
            <div className="welcome-banner" style={{ marginBottom: '32px' }}>
                <h1 style={{ color: '#004d40', marginBottom: '8px' }}>Welcome Client</h1>
                <p style={{ color: '#666' }}>You can monitor your project progress and review work activity here.</p>
            </div>

            <div className="client-stats-grid">
                <div className="client-stat-card">
                    <h3>Total Assigned Projects</h3>
                    <p>{stats.totalProjects}</p>
                </div>
                <div className="client-stat-card">
                    <h3>Active Projects</h3>
                    <p>{stats.activeProjects}</p>
                </div>
                <div className="client-stat-card">
                    <h3>Completed Tasks</h3>
                    <p>{stats.completedTasks}</p>
                </div>
                <div className="client-stat-card">
                    <h3>Total Work Hours</h3>
                    <p>{stats.totalHours}</p>
                </div>
                <div className="client-stat-card">
                    <h3>Project Completion Percentage</h3>
                    <p>{stats.progress}%</p>
                </div>
            </div>
        </ClientLayout>
    );
};

export default ClientDashboardMain;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRHeader from '../components/HRHeader';

const HRDashboardMain = () => {
    const [stats, setStats] = useState({
        total_employees: 0,
        active_employees: 0,
        total_managers: 0,
        total_teamleads: 0,
        pending_timesheets: 0,
        monthly_payroll_cost: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8001/api/hr/dashboard/');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching HR stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <HRHeader title="HR Dashboard Overview" />
            
            <div className="hr-stats-grid">
                <div className="hr-stat-card">
                    <div className="hr-stat-label">Total Employees</div>
                    <div className="hr-stat-value">{stats.total_employees}</div>
                </div>
                <div className="hr-stat-card" style={{ borderLeftColor: '#10b981' }}>
                    <div className="hr-stat-label">Active Employees</div>
                    <div className="hr-stat-value">{stats.active_employees}</div>
                </div>
                <div className="hr-stat-card" style={{ borderLeftColor: '#6366f1' }}>
                    <div className="hr-stat-label">Total Managers</div>
                    <div className="hr-stat-value">{stats.total_managers}</div>
                </div>
                <div className="hr-stat-card" style={{ borderLeftColor: '#f59e0b' }}>
                    <div className="hr-stat-label">Total Team Leads</div>
                    <div className="hr-stat-value">{stats.total_teamleads}</div>
                </div>
                <div className="hr-stat-card" style={{ borderLeftColor: '#ef4444' }}>
                    <div className="hr-stat-label">Pending Timesheets</div>
                    <div className="hr-stat-value">{stats.pending_timesheets}</div>
                </div>
                <div className="hr-stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
                    <div className="hr-stat-label">Monthly Payroll</div>
                    <div className="hr-stat-value">${stats.monthly_payroll_cost.toLocaleString()}</div>
                </div>
            </div>

            <div className="hr-table-card">
                <h3>Quick Actions</h3>
                <p>Welcome to the HR Management Portal. Use the sidebar to manage employees, track attendance, and process payroll.</p>
            </div>
        </div>
    );
};

export default HRDashboardMain;

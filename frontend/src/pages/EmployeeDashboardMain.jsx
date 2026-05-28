import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeDashboardMain = () => {
  const [stats, setStats] = useState({
    total_projects: 0,
    total_tasks: 0,
    pending_tasks: 0,
    submitted_timesheets: 0,
    completion_rate: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        const res = await axios.get(`http://127.0.0.1:8001/api/employee/dashboard/?user_id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching employee stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="employee-page-header">
        <h1 className="employee-page-title">Overview</h1>
      </div>

      <div className="employee-stats-grid">
        <div className="employee-stat-card">
          <span className="employee-stat-title">Total Assigned Projects</span>
          <span className="employee-stat-value">{stats.total_projects}</span>
        </div>
        <div className="employee-stat-card orange">
          <span className="employee-stat-title">Total Tasks</span>
          <span className="employee-stat-value">{stats.total_tasks}</span>
        </div>
        <div className="employee-stat-card purple">
          <span className="employee-stat-title">Pending Tasks</span>
          <span className="employee-stat-value">{stats.pending_tasks}</span>
        </div>
        <div className="employee-stat-card green">
          <span className="employee-stat-title">Submitted Timesheets</span>
          <span className="employee-stat-value">{stats.submitted_timesheets}</span>
        </div>
        <div className="employee-stat-card">
          <span className="employee-stat-title">Project Completion</span>
          <span className="employee-stat-value">{stats.completion_rate}%</span>
        </div>
      </div>
      
      <div className="employee-card" style={{ padding: '24px' }}>
        <h3>Welcome back!</h3>
        <p style={{ color: '#475569', marginTop: '12px' }}>
          Select an option from the sidebar to view your projects, submit task updates, or log your hours.
        </p>
      </div>
    </div>
  );
};

export default EmployeeDashboardMain;

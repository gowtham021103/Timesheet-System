import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import DashboardCards from '../components/DashboardCards';
import axios from 'axios';

const AdminDashboardMain = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalEmployees: 0,
    activeProjects: 0,
    timesheetsSubmitted: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    // In a real app, fetch these from specific analytics endpoints
    const fetchStats = async () => {
      try {
        const users = await axios.get('http://127.0.0.1:8001/api/users/');
        const projects = await axios.get('http://127.0.0.1:8001/api/projects/');
        const timesheets = await axios.get('http://127.0.0.1:8001/api/timesheets/');
        
        const employees = users.data.filter(u => u.role === 'employee').length;
        const pending = timesheets.data.filter(t => t.status === 'Pending').length;

        setStats({
          totalUsers: users.data.length,
          totalProjects: projects.data.length,
          totalEmployees: employees,
          activeProjects: projects.data.length, // Simplified
          timesheetsSubmitted: timesheets.data.length,
          pendingApprovals: pending
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="welcome-section">
        <h1 style={{ marginBottom: '8px' }}>Admin Dashboard</h1>
        <p style={{ color: '#475467', marginBottom: '32px' }}>
          Welcome Admin, you have successfully logged into the Admin Dashboard.
        </p>
      </div>
      <DashboardCards stats={stats} />
    </AdminLayout>
  );
};

export default AdminDashboardMain;

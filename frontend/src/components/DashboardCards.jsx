import React from 'react';

const StatCard = ({ title, count, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{count}</p>
    </div>
  );
};

const DashboardCards = ({ stats }) => {
  return (
    <div className="stats-grid">
      <StatCard title="Total Users" count={stats.totalUsers} icon="👥" />
      <StatCard title="Total Projects" count={stats.totalProjects} icon="📁" />
      <StatCard title="Total Employees" count={stats.totalEmployees} icon="👷" />
      <StatCard title="Active Projects" count={stats.activeProjects} icon="🚀" />
      <StatCard title="Timesheets Submitted" count={stats.timesheetsSubmitted} icon="📝" />
      <StatCard title="Pending Approvals" count={stats.pendingApprovals} icon="⏳" />
    </div>
  );
};

export default DashboardCards;

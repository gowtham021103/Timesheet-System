import React from 'react';

const ManagerHeader = ({ title }) => {
  const username = localStorage.getItem('username') || 'Manager';
  return (
    <header className="manager-header">
      <h2>{title}</h2>
      <div className="manager-user-info">
        <span style={{ fontWeight: 600 }}>{username}</span>
      </div>
    </header>
  );
};

export default ManagerHeader;

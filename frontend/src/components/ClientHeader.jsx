import React from 'react';

const ClientHeader = ({ title }) => {
  const username = localStorage.getItem('username') || 'Client';
  return (
    <header className="client-header">
      <h2>{title}</h2>
      <div className="client-user-info">
        <span style={{ fontWeight: 600 }}>{username}</span>
      </div>
    </header>
  );
};

export default ClientHeader;

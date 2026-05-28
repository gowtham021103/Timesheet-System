import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeHeader = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Employee';

  return (
    <header className="employee-header">
      <h2>Employee Dashboard</h2>
      <div className="employee-user-profile">
        <div className="employee-user-info">
          <span>{username}</span>
          <small>Employee</small>
        </div>
        <div className="employee-avatar">
          {username.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default EmployeeHeader;

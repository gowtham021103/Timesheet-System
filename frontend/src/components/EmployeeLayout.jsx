import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeHeader from './EmployeeHeader';
import '../styles/employeeDashboard.css';

const EmployeeLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'employee') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="employee-dashboard-layout">
      <EmployeeSidebar />
      <div className="employee-main-content">
        <EmployeeHeader />
        <main className="employee-page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;

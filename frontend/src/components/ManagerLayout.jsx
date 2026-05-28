import React from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerSidebar from './ManagerSidebar';
import ManagerHeader from './ManagerHeader';
import '../styles/managerDashboard.css';

const ManagerLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  React.useEffect(() => {
    if (userRole !== 'manager') {
      navigate('/');
    }
  }, [userRole, navigate]);

  if (userRole !== 'manager') return null;

  return (
    <div className="manager-layout">
      <ManagerSidebar />
      <main className="manager-main">
        <ManagerHeader title={title} />
        <div className="manager-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ManagerLayout;

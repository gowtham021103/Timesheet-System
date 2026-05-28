import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../styles/adminDashboard.css';

const AdminLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role'); // Simplified role storage

  React.useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/');
    }
  }, [userRole, navigate]);

  if (userRole !== 'admin') return null;
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <Header title={title} />
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

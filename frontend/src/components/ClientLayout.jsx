import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from './ClientSidebar';
import ClientHeader from './ClientHeader';
import '../styles/clientDashboard.css';

const ClientLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  React.useEffect(() => {
    if (userRole !== 'client') {
      // Small delay to prevent flashing if redirecting from login
      navigate('/');
    }
  }, [userRole, navigate]);

  if (userRole !== 'client') return null;

  return (
    <div className="client-layout">
      <ClientSidebar />
      <main className="client-main">
        <ClientHeader title={title} />
        <div className="client-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;

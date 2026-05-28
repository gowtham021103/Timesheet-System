import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeamLeadSidebar from './TeamLeadSidebar';
import TeamLeadHeader from './TeamLeadHeader';
import '../styles/teamLeadDashboard.css';

const TeamLeadLayout = ({ children, title }) => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');

    React.useEffect(() => {
        if (userRole !== 'teamlead') {
            navigate('/');
        }
    }, [userRole, navigate]);

    if (userRole !== 'teamlead') return null;

    return (
        <div className="teamlead-layout">
            <TeamLeadSidebar />
            <main className="teamlead-main">
                <TeamLeadHeader title={title} />
                <div className="teamlead-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default TeamLeadLayout;

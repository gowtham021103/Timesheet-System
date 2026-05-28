import React from 'react';

const TeamLeadHeader = ({ title }) => {
    const username = localStorage.getItem('username');
    
    return (
        <header className="teamlead-header">
            <h2>{title}</h2>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: '#f0f2f5', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', color: '#555' }}>
                    Welcome, <strong>{username}</strong> (Team Lead)
                </div>
            </div>
        </header>
    );
};

export default TeamLeadHeader;

import React from 'react';

const HRHeader = ({ title }) => {
    const username = localStorage.getItem('username');

    return (
        <header className="hr-header">
            <div className="hr-header-title">
                <h1>{title}</h1>
            </div>
            <div className="hr-header-user">
                <span>Welcome, <strong>{username}</strong> (HR)</span>
            </div>
        </header>
    );
};

export default HRHeader;

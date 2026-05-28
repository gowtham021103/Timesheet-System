import React, { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import axios from 'axios';

const Reports = () => {
    return (
        <ClientLayout title="Project Reports">
            <div className="client-stats-grid">
                <div className="client-stat-card">
                    <h3>Overall Progress</h3>
                    <p>75%</p>
                </div>
                <div className="client-stat-card">
                    <h3>Total Hours Spent</h3>
                    <p>220</p>
                </div>
            </div>
            <div className="client-table-container">
                <div style={{ padding: '24px' }}>
                    <h3>Weekly Work Summary</h3>
                    <p style={{ color: '#666', marginTop: '8px' }}>Reports such as project progress, work hours, and task completion can be viewed here.</p>
                </div>
            </div>
        </ClientLayout>
    );
};

export default Reports;

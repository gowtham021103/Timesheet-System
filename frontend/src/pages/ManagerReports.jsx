import React, { useState, useEffect } from 'react';
import ManagerLayout from '../components/ManagerLayout';
import axios from 'axios';

const ManagerReports = () => {
    return (
        <ManagerLayout title="Manager Reports">
            <div className="manager-stats-grid">
                <div className="manager-stat-card">
                    <h3>Overall Project Completion</h3>
                    <p>75%</p>
                </div>
                <div className="manager-stat-card">
                    <h3>Total Logged Hours</h3>
                    <p>210 Hours</p>
                </div>
                <div className="manager-stat-card">
                    <h3>Active Team Members</h3>
                    <p>12</p>
                </div>
            </div>
            
            <div className="manager-table-container" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '16px', color: '#333' }}>Generate Custom Reports</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="manager-btn manager-btn-primary">Project Progress Report</button>
                    <button className="manager-btn manager-btn-primary">Employee Work Report</button>
                    <button className="manager-btn manager-btn-primary">Timesheet Summary</button>
                </div>
            </div>
        </ManagerLayout>
    );
};

export default ManagerReports;

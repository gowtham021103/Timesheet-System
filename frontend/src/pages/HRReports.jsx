import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRHeader from '../components/HRHeader';

const HRReports = () => {
    const [reports, setReports] = useState({
        total_employees: 0,
        total_hours_worked: 0,
        total_payroll_cost: 0,
        project_productivity: []
    });

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8001/api/hr/reports/');
                setReports(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };
        fetchReports();
    }, []);

    return (
        <div>
            <HRHeader title="System Reports" />
            
            <div className="hr-stats-grid">
                <div className="hr-stat-card">
                    <div className="hr-stat-label">System Employees</div>
                    <div className="hr-stat-value">{reports.total_employees}</div>
                </div>
                <div className="hr-stat-card" style={{ borderLeftColor: '#10b981' }}>
                    <div className="hr-stat-label">Total Approved Hours</div>
                    <div className="hr-stat-value">{reports.total_hours_worked}</div>
                </div>
                <div className="hr-stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
                    <div className="hr-stat-label">Total Payroll Liability</div>
                    <div className="hr-stat-value">${reports.total_payroll_cost.toLocaleString()}</div>
                </div>
            </div>

            <div className="hr-table-card">
                <h3>Project Productivity (Hours Logged)</h3>
                <div style={{ marginTop: '20px' }}>
                    {reports.project_productivity.map((proj, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <strong>{proj.project}</strong>
                                <span>{proj.hours} hrs</span>
                            </div>
                            <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px' }}>
                                <div style={{ 
                                    width: `${Math.min(100, (proj.hours / (reports.total_hours_worked || 1)) * 100)}%`, 
                                    height: '100%', 
                                    backgroundColor: '#38bdf8', 
                                    borderRadius: '5px' 
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HRReports;

import React, { useState, useEffect } from 'react';
import TeamLeadLayout from '../components/TeamLeadLayout';
import axios from 'axios';

const TeamLeadReports = () => {
    const [reports, setReports] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            const userId = localStorage.getItem('id');
            const token = localStorage.getItem('token') || '';
            try {
                const res = await axios.get(`http://127.0.0.1:8001/api/teamlead/reports/?user_id=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReports(res.data);
            } catch (err) {
                console.error("Error fetching reports", err);
            }
        };
        fetchReports();
    }, []);

    if (!reports) return <TeamLeadLayout title="Reports">Loading...</TeamLeadLayout>;

    return (
        <TeamLeadLayout title="Reports">
            <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', color: '#333' }}>Project Progress Report</h3>
                
                {reports.project_progress && reports.project_progress.length > 0 ? (
                    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {reports.project_progress.map((p, index) => (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, color: '#444' }}>
                                    <span>{p.project}</span>
                                    <span>{p.progress}%</span>
                                </div>
                                <div style={{ width: '100%', height: '12px', backgroundColor: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{ width: `${p.progress}%`, height: '100%', backgroundColor: '#00bcd4', transition: 'width 1s ease-in-out' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#666', marginTop: '20px' }}>No project data available.</p>
                )}
            </div>
        </TeamLeadLayout>
    );
};

export default TeamLeadReports;

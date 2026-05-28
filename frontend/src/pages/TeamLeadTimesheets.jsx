import React, { useState, useEffect } from 'react';
import TeamLeadLayout from '../components/TeamLeadLayout';
import axios from 'axios';

const TeamLeadTimesheets = () => {
    const [timesheets, setTimesheets] = useState([]);

    const fetchTimesheets = async () => {
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token') || '';
        try {
            const res = await axios.get(`http://127.0.0.1:8001/api/teamlead/timesheets/?user_id=${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTimesheets(res.data);
        } catch (err) {
            console.error("Error fetching timesheets", err);
        }
    };

    useEffect(() => {
        fetchTimesheets();
    }, []);

    const handleAction = async (id, actionType) => {
        const token = localStorage.getItem('token') || '';
        try {
            const endpoint = actionType === 'approve' ? '/api/timesheets/approve/' : '/api/timesheets/reject/';
            await axios.post(`http://127.0.0.1:8001${endpoint}`, { timesheet_id: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTimesheets();
        } catch (err) {
            alert(`Error ${actionType}ing timesheet: ` + err.message);
        }
    };

    return (
        <TeamLeadLayout title="Timesheet Review">
            <div className="teamlead-table-container">
                {timesheets.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#666' }}>
                        No timesheets to review.
                    </div>
                ) : (
                    <table className="teamlead-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Project</th>
                                <th>Date</th>
                                <th>Hours Worked</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timesheets.map(t => (
                                <tr key={t.id}>
                                    <td style={{ fontWeight: 600 }}>{t.username}</td>
                                    <td>{t.project_name}</td>
                                    <td>{t.date}</td>
                                    <td>{parseFloat(t.hours)}</td>
                                    <td>
                                        <span className={`teamlead-status-badge status-${t.status.toLowerCase()}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td>
                                        {t.status === 'Pending' ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button 
                                                    onClick={() => handleAction(t.id, 'approve')}
                                                    style={{ background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(t.id, 'reject')}
                                                    style={{ background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Reviewed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </TeamLeadLayout>
    );
};

export default TeamLeadTimesheets;

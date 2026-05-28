import React, { useState, useEffect } from 'react';
import ManagerLayout from '../components/ManagerLayout';
import axios from 'axios';

const Timesheets = () => {
    const [timesheets, setTimesheets] = useState([]);
    
    const fetchTimesheets = async () => {
        const userId = localStorage.getItem('id');
        const res = await axios.get(`http://127.0.0.1:8001/api/timesheets/?role=manager&user_id=${userId}`);
        setTimesheets(res.data);
    };

    useEffect(() => {
        fetchTimesheets();
    }, []);

    const handleAction = async (id, action) => {
        try {
            await axios.patch(`http://127.0.0.1:8001/api/timesheets/${id}/${action}/`);
            fetchTimesheets();
        } catch (err) {
            alert(`Error ${action} timesheet: ${err.message}`);
        }
    };

    return (
        <ManagerLayout title="Review Timesheets">
            <div className="manager-table-container">
                <table className="manager-table">
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
                                <td>{t.username}</td>
                                <td>{t.project_name}</td>
                                <td>{t.date}</td>
                                <td>{t.hours}</td>
                                <td>
                                    <span style={{ 
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600,
                                        color: t.status === 'Approved' ? '#2e7d32' : t.status === 'Rejected' ? '#d32f2f' : '#ed6c02',
                                        backgroundColor: t.status === 'Approved' ? '#e8f5e9' : t.status === 'Rejected' ? '#ffebee' : '#fff3e0'
                                    }}>
                                        {t.status}
                                    </span>
                                </td>
                                <td>
                                    {t.status === 'Pending' && (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="manager-btn manager-btn-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleAction(t.id, 'approve')}>Approve</button>
                                            <button className="manager-btn manager-btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleAction(t.id, 'reject')}>Reject</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ManagerLayout>
    );
};

export default Timesheets;

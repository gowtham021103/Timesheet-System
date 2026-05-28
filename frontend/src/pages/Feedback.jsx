import React, { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import axios from 'axios';

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('http://127.0.0.1:8001/api/feedbacks/');
            setFeedbacks(res.data);
        };
        fetchData();
    }, []);

    return (
        <ClientLayout title="Feedback & Approvals">
            <div className="client-table-container">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Task Name</th>
                            <th>Feedback</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map(f => (
                            <tr key={f.id}>
                                <td>{f.task_name}</td>
                                <td>{f.client_feedback}</td>
                                <td>{f.is_approved ? 'Approved' : 'Pending'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="client-btn client-btn-primary" style={{ marginTop: '24px' }}>Provide New Feedback</button>
        </ClientLayout>
    );
};

export default Feedback;

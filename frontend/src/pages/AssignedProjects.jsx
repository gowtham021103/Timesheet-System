import React, { useState, useEffect } from 'react';
import ManagerLayout from '../components/ManagerLayout';
import axios from 'axios';

const AssignedProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const userId = localStorage.getItem('id');
            const token = localStorage.getItem('token') || '';
            try {
                const res = await axios.get(`http://127.0.0.1:8001/api/manager/projects/?user_id=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProjects(res.data);
            } catch (err) {
                console.error("Error fetching projects", err);
            }
        };
        fetchProjects();
    }, []);

    return (
        <ManagerLayout title="Assigned Projects">
            <div className="manager-table-container">
                {projects.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#666', fontSize: '1rem' }}>
                        No projects assigned to you yet.
                    </div>
                ) : (
                    <table className="manager-table">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Client</th>
                                <th>Deadline</th>
                                <th>Status</th>
                                <th>Assigned Team Lead</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(p => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                                    <td>{p.client_name}</td>
                                    <td>{p.deadline}</td>
                                    <td>
                                        <span style={{ 
                                            padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.8rem',
                                            backgroundColor: p.status === 'Active' ? '#e8eaf6' : '#f5f5f5'
                                        }}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td>
                                        {p.team_lead_name || <span style={{ color: '#999', fontStyle: 'italic' }}>Unassigned</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </ManagerLayout>
    );
};

export default AssignedProjects;

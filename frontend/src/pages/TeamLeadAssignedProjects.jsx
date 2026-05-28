import React, { useState, useEffect } from 'react';
import TeamLeadLayout from '../components/TeamLeadLayout';
import axios from 'axios';

const TeamLeadAssignedProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const userId = localStorage.getItem('id');
            const token = localStorage.getItem('token') || '';
            try {
                const res = await axios.get(`http://127.0.0.1:8001/api/teamlead/projects/?user_id=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(res.data);
            } catch (err) {
                console.error("Error fetching projects", err);
            }
        };
        fetchProjects();
    }, []);

    return (
        <TeamLeadLayout title="Assigned Projects">
            <div className="teamlead-table-container">
                {projects.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#666' }}>
                        No projects assigned yet.
                    </div>
                ) : (
                    <table className="teamlead-table">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Manager</th>
                                <th>Deadline</th>
                                <th>Status</th>
                                <th>Progress %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(p => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                                    <td>{p.manager_name}</td>
                                    <td>{p.deadline}</td>
                                    <td>
                                        <span className={`teamlead-status-badge status-${p.status.toLowerCase()}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td>{p.progress}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </TeamLeadLayout>
    );
};

export default TeamLeadAssignedProjects;

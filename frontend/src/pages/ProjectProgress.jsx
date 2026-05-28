import React, { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import axios from 'axios';

const ProjectProgress = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const role = localStorage.getItem('role');
            const userId = localStorage.getItem('id');
            const res = await axios.get(`http://127.0.0.1:8001/api/projects/?role=${role}&user_id=${userId}`);
            setProjects(res.data);
        };
        fetchProjects();
    }, []);

    return (
        <ClientLayout title="Project Progress">
            <div style={{ display: 'grid', gap: '24px' }}>
                {projects.map(p => (
                    <div key={p.id} className="client-stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '1.1rem', color: '#333' }}>{p.name}</h3>
                            <span style={{ fontWeight: 700, color: '#004d40' }}>{p.progress}% Completed</span>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${p.progress}%` }}></div>
                        </div>
                        <div style={{ marginTop: '16px', fontSize: '0.9rem', color: '#666' }}>
                           <strong>Latest Milestone:</strong> Phase 1 Requirements Finalized
                        </div>
                    </div>
                ))}
            </div>
        </ClientLayout>
    );
};

export default ProjectProgress;

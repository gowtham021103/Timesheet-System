import React, { useState, useEffect } from 'react';
import ManagerLayout from '../components/ManagerLayout';
import axios from 'axios';

const ProjectProgress = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const userId = localStorage.getItem('id');
            const res = await axios.get(`http://127.0.0.1:8001/api/projects/manager/?user_id=${userId}`);
            setProjects(res.data);
        };
        fetchProjects();
    }, []);

    return (
        <ManagerLayout title="Project Progress">
            <div style={{ display: 'grid', gap: '24px' }}>
                {projects.map(p => (
                    <div key={p.id} className="manager-stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '1.2rem', color: '#333' }}>{p.name}</h3>
                            <span style={{ fontWeight: 700, color: 'var(--manager-primary)' }}>{p.progress}% Completed</span>
                        </div>
                        <div style={{ width: '100%', background: '#eee', borderRadius: '4px', height: '10px' }}>
                            <div style={{ background: 'var(--manager-primary)', height: '100%', borderRadius: '4px', width: `${p.progress}%` }}></div>
                        </div>
                        <div style={{ marginTop: '16px', fontSize: '0.9rem', color: '#666' }}>
                           <strong>Latest Updates:</strong> Monitor progress from Team Leads.
                        </div>
                    </div>
                ))}
            </div>
        </ManagerLayout>
    );
};

export default ProjectProgress;

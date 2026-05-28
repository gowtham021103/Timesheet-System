import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeProjectProgress = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        // We reuse the basic projects endpoint to get the progress tracking bars
        const res = await axios.get(`http://127.0.0.1:8001/api/employee/projects/?user_id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div>Loading progress...</div>;

  return (
    <div>
      <div className="employee-page-header">
        <h1 className="employee-page-title">Project Progress</h1>
      </div>

      <div className="employee-card" style={{ padding: '24px' }}>
        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>No active projects found.</p>
        ) : (
          projects.map(p => (
            <div key={p.id} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: '#1e293b' }}>{p.name}</strong>
                <span style={{ fontWeight: 600, color: p.progress === 100 ? '#10b981' : '#3b82f6' }}>
                  {p.progress}%
                </span>
              </div>
              <div className="employee-progress-container" style={{ height: '12px' }}>
                <div 
                  className="employee-progress-fill" 
                  style={{ width: `${p.progress}%`, backgroundColor: p.progress === 100 ? '#10b981' : '#3b82f6' }}
                ></div>
              </div>
              <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                Status: <span className={`employee-badge ${p.status.toLowerCase().replace(' ', '-')}`}>{p.status}</span>
                <span style={{ marginLeft: '12px' }}>Deadline: {p.deadline}</span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeProjectProgress;

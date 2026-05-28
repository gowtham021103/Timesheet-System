import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeMyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
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

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      <div className="employee-page-header">
        <h1 className="employee-page-title">My Projects</h1>
      </div>

      <div className="employee-card">
        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Description</th>
                <th>Team Lead</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>
                    No projects assigned to you yet.
                  </td>
                </tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.description.substring(0, 50)}...</td>
                    <td>{p.team_lead_name || 'Unassigned'}</td>
                    <td>{p.deadline}</td>
                    <td>
                      <span className={`employee-badge ${p.status.toLowerCase().replace(' ', '-')}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div>{p.progress}%</div>
                      <div className="employee-progress-container" style={{ height: '6px' }}>
                        <div 
                          className="employee-progress-fill" 
                          style={{ width: `${p.progress}%`, backgroundColor: p.progress === 100 ? '#10b981' : '#3b82f6' }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeMyProjects;

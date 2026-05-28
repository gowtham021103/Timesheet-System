import React from 'react';

const ProjectTable = ({ projects }) => {
  return (
    <div className="client-table-container">
      <table className="client-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Manager</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td style={{ fontWeight: 600 }}>{p.name}</td>
              <td>{p.manager_name}</td>
              <td>{p.deadline}</td>
              <td>
                <span style={{ 
                  padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.8rem',
                  backgroundColor: p.status === 'Active' ? '#e3f2fd' : '#f5f5f5'
                }}>
                  {p.status}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="progress-bar-container" style={{ width: '100px' }}>
                    <div className="progress-bar-fill" style={{ width: `${p.progress}%` }}></div>
                  </div>
                  <span>{p.progress}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import axios from 'axios';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState({ name: '', description: '', client: '', deadline: '', manager: '' });

  const fetchData = async () => {
    const pRes = await axios.get('http://127.0.0.1:8001/api/projects/');
    const uRes = await axios.get('http://127.0.0.1:8001/api/users/');
    setProjects(pRes.data);
    setManagers(uRes.data.filter(u => u.role === 'manager' || u.role === 'teamlead'));
    setClients(uRes.data.filter(u => u.role === 'client'));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8001/api/projects/', currentProject);
      setShowModal(false);
      fetchData();
      setCurrentProject({ name: '', description: '', client: '', deadline: '', manager: '' });
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const messages = Object.keys(errorData).map(key => {
          const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
          return `${fieldName}: ${Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key]}`;
        });
        alert(messages.join('\n'));
      } else {
        alert("Error saving project: " + err.message);
      }
    }
  };

  return (
    <AdminLayout title="Project Management">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3>Company Projects</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Project</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Client</th>
              <th>Manager/Lead</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.client_name}</td>
                <td>{p.manager_name}</td>
                <td>{p.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create Project</h3>
            <form onSubmit={handleSave}>
              <div className="form-field">
                <label>Project Name</label>
                <input type="text" value={currentProject.name} onChange={e => setCurrentProject({...currentProject, name: e.target.value})} required />
              </div>
              <div className="form-field">
                <label>Description</label>
                <input type="text" value={currentProject.description} onChange={e => setCurrentProject({...currentProject, description: e.target.value})} required />
              </div>
              <div className="form-field">
                <label>Client</label>
                <select value={currentProject.client} onChange={e => setCurrentProject({...currentProject, client: e.target.value})} required>
                  <option value="">Select Client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Deadline</label>
                <input type="date" value={currentProject.deadline} onChange={e => setCurrentProject({...currentProject, deadline: e.target.value})} required />
              </div>
              <div className="form-field">
                <label>Assign Manager/Lead</label>
                <select value={currentProject.manager} onChange={e => setCurrentProject({...currentProject, manager: e.target.value})} required>
                  <option value="">Select...</option>
                  {managers.map(u => <option key={u.id} value={u.id}>{u.username} ({u.role})</option>)}
                </select>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary">Create</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProjectManagement;

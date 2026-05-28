import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import axios from 'axios';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState({ manager: '', team_lead: '', employee: '', project: '' });

  const fetchData = async () => {
    const [tRes, uRes, pRes] = await Promise.all([
      axios.get('http://127.0.0.1:8001/api/teams/'),
      axios.get('http://127.0.0.1:8001/api/users/'),
      axios.get('http://127.0.0.1:8001/api/projects/')
    ]);
    setTeams(tRes.data);
    setUsers(uRes.data);
    setProjects(pRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8001/api/teams/', currentTeam);
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Error saving team assignment: " + err.message);
    }
  };

  return (
    <AdminLayout title="Team Structure">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3>Company Hierarchy</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Assignment</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Manager</th>
              <th>Team Lead</th>
              <th>Employee</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(t => (
              <tr key={t.id}>
                <td>{t.project_name}</td>
                <td>{t.manager_name}</td>
                <td>{t.team_lead_name}</td>
                <td>{t.employee_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Assign Team</h3>
            <form onSubmit={handleSave}>
              <div className="form-field">
                <label>Project</label>
                <select onChange={e => setCurrentTeam({...currentTeam, project: e.target.value})} required>
                  <option value="">Select...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Manager</label>
                <select onChange={e => setCurrentTeam({...currentTeam, manager: e.target.value})} required>
                  <option value="">Select...</option>
                  {users.filter(u => u.role === 'manager').map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Team Lead</label>
                <select onChange={e => setCurrentTeam({...currentTeam, team_lead: e.target.value})} required>
                  <option value="">Select...</option>
                  {users.filter(u => u.role === 'teamlead').map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Employee</label>
                <select onChange={e => setCurrentTeam({...currentTeam, employee: e.target.value})} required>
                  <option value="">Select...</option>
                  {users.filter(u => u.role === 'employee').map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                </select>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary">Assign</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default TeamManagement;

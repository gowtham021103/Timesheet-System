import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: '', password: '', role: 'employee' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchUsers = async () => {
    const res = await axios.get('http://127.0.0.1:8001/api/users/');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://127.0.0.1:8001/api/users/${currentUser.id}/`, currentUser);
      } else {
        await axios.post('http://127.0.0.1:8001/api/users/', currentUser);
      }
      setShowModal(false);
      fetchUsers();
      setCurrentUser({ username: '', password: '', role: 'employee' });
    } catch (err) {
      alert("Error saving user: " + (err.response?.data?.username || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete(`http://127.0.0.1:8001/api/users/${id}/`);
      fetchUsers();
    }
  };

  return (
    <AdminLayout title="User Management">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3>System Users</h3>
        <button className="btn btn-primary" onClick={() => { setIsEditing(false); setShowModal(true); }}>
          + Create New User
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                <td>
                  <button className="btn" onClick={() => { setIsEditing(true); setCurrentUser(u); setShowModal(true); }}>Edit</button>
                  <button className="btn btn-danger" style={{ marginLeft: '8px' }} onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit User' : 'Create New User'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-field">
                <label>Username</label>
                <input 
                  type="text" 
                  value={currentUser.username} 
                  onChange={e => setCurrentUser({...currentUser, username: e.target.value})} 
                  required 
                />
              </div>
              {!isEditing && (
                <div className="form-field">
                  <label>Password</label>
                  <input 
                    type="password" 
                    value={currentUser.password} 
                    onChange={e => setCurrentUser({...currentUser, password: e.target.value})} 
                    required 
                  />
                </div>
              )}
              <div className="form-field">
                <label>Role</label>
                <select 
                  value={currentUser.role} 
                  onChange={e => setCurrentUser({...currentUser, role: e.target.value})}
                >
                  <option value="admin">Admin</option>
                  <option value="hr">HR</option>
                  <option value="manager">Manager</option>
                  <option value="teamlead">Team Lead</option>
                  <option value="employee">Employee</option>
                  <option value="client">Client</option>
                </select>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary">Save User</button>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserManagement;

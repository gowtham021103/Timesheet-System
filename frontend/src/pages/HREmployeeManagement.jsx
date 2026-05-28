import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRHeader from '../components/HRHeader';

const HREmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'employee',
        department: '',
        joining_date: '',
        status: 'Active',
        hourly_rate: 0
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8001/api/hr/employees/');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://127.0.0.1:8001/api/hr/employees/${editingId}/`, formData);
            } else {
                await axios.post('http://127.0.0.1:8001/api/hr/employees/', formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({
                username: '', password: '', email: '', role: 'employee',
                department: '', joining_date: '', status: 'Active', hourly_rate: 0
            });
            fetchEmployees();
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('Error saving employee data');
        }
    };

    const handleEdit = (emp) => {
        setFormData({
            username: emp.username,
            email: emp.email,
            role: emp.role,
            department: emp.department || '',
            joining_date: emp.joining_date || '',
            status: emp.status || 'Active',
            hourly_rate: emp.hourly_rate || 0
        });
        setEditingId(emp.id);
        setShowForm(true);
    };

    const handleDeactivate = async (id) => {
        if (window.confirm('Are you sure you want to deactivate this employee?')) {
            try {
                await axios.delete(`http://127.0.0.1:8001/api/hr/employees/${id}/`);
                fetchEmployees();
            } catch (error) {
                console.error('Error deactivating employee:', error);
            }
        }
    };

    return (
        <div>
            <HRHeader title="Employee Management" />
            
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="hr-submit-btn" style={{ width: 'auto' }} onClick={() => {setShowForm(!showForm); setEditingId(null);}}>
                    {showForm ? 'Cancel' : 'Add New Employee'}
                </button>
            </div>

            {showForm && (
                <div className="hr-form-card" style={{ marginBottom: '30px' }}>
                    <h3>{editingId ? 'Edit Employee' : 'Add New Employee'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="hr-form-group">
                            <label>Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="hr-form-input" required />
                        </div>
                        {!editingId && (
                            <div className="hr-form-group">
                                <label>Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="hr-form-input" required />
                            </div>
                        )}
                        <div className="hr-form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="hr-form-input" required />
                        </div>
                        <div className="hr-form-group">
                            <label>Department</label>
                            <input type="text" name="department" value={formData.department} onChange={handleInputChange} className="hr-form-input" />
                        </div>
                        <div className="hr-form-group">
                            <label>Hourly Rate ($)</label>
                            <input type="number" name="hourly_rate" value={formData.hourly_rate} onChange={handleInputChange} className="hr-form-input" />
                        </div>
                        <div className="hr-form-group">
                            <label>Joining Date</label>
                            <input type="date" name="joining_date" value={formData.joining_date} onChange={handleInputChange} className="hr-form-input" />
                        </div>
                        <button type="submit" className="hr-submit-btn">{editingId ? 'Update' : 'Save'} Employee</button>
                    </form>
                </div>
            )}

            <div className="hr-table-card">
                <table className="hr-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Department</th>
                            <th>Hourly Rate</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.username}</td>
                                <td>{emp.department || 'N/A'}</td>
                                <td>${emp.hourly_rate}</td>
                                <td>
                                    <span className={`status-badge status-${emp.status.toLowerCase()}`}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-edit" onClick={() => handleEdit(emp)}>Edit</button>
                                    <button className="btn-delete" onClick={() => handleDeactivate(emp.id)}>Deactivate</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HREmployeeManagement;

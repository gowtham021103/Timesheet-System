import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeSubmitTimesheet = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project_id: '',
    date: new Date().toISOString().split('T')[0],
    hours_worked: '',
    description: ''
  });
  const [message, setMessage] = useState('');

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
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      await axios.post(`http://127.0.0.1:8001/api/timesheets/submit/?user_id=${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Timesheet submitted successfully!');
      setFormData({
        project_id: '',
        date: new Date().toISOString().split('T')[0],
        hours_worked: '',
        description: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Error submitting timesheet:", err);
      setMessage('Failed to submit timesheet.');
    }
  };

  return (
    <div>
      <div className="employee-page-header">
        <h1 className="employee-page-title">Submit Timesheet</h1>
      </div>

      <div className="employee-form-container">
        {message && (
          <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '4px', backgroundColor: message.includes('success') ? '#dcfce7' : '#fee2e2', color: message.includes('success') ? '#166534' : '#991b1b' }}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="employee-form-group">
            <label>Project</label>
            <select 
              name="project_id" 
              className="employee-form-control" 
              value={formData.project_id} 
              onChange={handleChange} 
              required
            >
              <option value="">Select a project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          
          <div className="employee-form-group">
            <label>Date</label>
            <input 
              type="date" 
              name="date" 
              className="employee-form-control" 
              value={formData.date} 
              onChange={handleChange} 
              required
            />
          </div>
          
          <div className="employee-form-group">
            <label>Hours Worked</label>
            <input 
              type="number" 
              step="0.1" 
              min="0.1"
              max="24"
              name="hours_worked" 
              className="employee-form-control" 
              value={formData.hours_worked} 
              onChange={handleChange} 
              placeholder="e.g. 7.5"
              required
            />
          </div>
          
          <div className="employee-form-group">
            <label>Description of Work</label>
            <textarea 
              name="description" 
              className="employee-form-control" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Describe what you worked on..."
              required
            />
          </div>
          
          <button type="submit" className="employee-btn">Submit Timesheet</button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeSubmitTimesheet;

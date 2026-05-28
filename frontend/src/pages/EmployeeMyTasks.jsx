import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeMyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      const res = await axios.get(`http://127.0.0.1:8001/api/employee/tasks/?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://127.0.0.1:8001/api/tasks/update/', {
        task_id: taskId,
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state without refreshing
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      console.error("Error updating task status:", err);
      alert("Failed to update task status");
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div>
      <div className="employee-page-header">
        <h1 className="employee-page-title">My Tasks</h1>
      </div>

      <div className="employee-card">
        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Project</th>
                <th>Description</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>
                    No tasks assigned to you yet.
                  </td>
                </tr>
              ) : (
                tasks.map(task => (
                  <tr key={task.id}>
                    <td style={{ fontWeight: 600 }}>{task.task_title}</td>
                    <td>{task.project_name}</td>
                    <td>{task.description.substring(0, 50)}...</td>
                    <td>{task.deadline}</td>
                    <td>
                      <span className={`employee-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        className="employee-status-select"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
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

export default EmployeeMyTasks;

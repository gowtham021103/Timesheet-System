import React, { useState, useEffect } from 'react';
import TeamLeadLayout from '../components/TeamLeadLayout';
import axios from 'axios';

const TeamLeadTaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({
        project: '',
        employee: '',
        task_title: '',
        description: '',
        deadline: '',
        status: 'Pending'
    });

    const fetchData = async () => {
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token') || '';
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const [tRes, pRes, eRes] = await Promise.all([
                axios.get(`http://127.0.0.1:8001/api/tasks/?role=teamlead&user_id=${userId}`, { headers }),
                axios.get(`http://127.0.0.1:8001/api/teamlead/projects/?user_id=${userId}`, { headers }),
                axios.get(`http://127.0.0.1:8001/api/teamlead/employees/?user_id=${userId}`, { headers })
            ]);
            setTasks(tRes.data);
            setProjects(pRes.data);
            setEmployees(eRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token') || '';
        try {
            await axios.post('http://127.0.0.1:8001/api/tasks/', newTask, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            setNewTask({ project: '', employee: '', task_title: '', description: '', deadline: '', status: 'Pending' });
            fetchData();
        } catch (err) {
            alert("Error creating task: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <TeamLeadLayout title="Task Management">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <button className="teamlead-btn teamlead-btn-primary" onClick={() => setShowModal(true)}>Assign New Task</button>
            </div>

            <div className="teamlead-table-container">
                {tasks.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#666' }}>
                        No tasks assigned yet.
                    </div>
                ) : (
                    <table className="teamlead-table">
                        <thead>
                            <tr>
                                <th>Task Title</th>
                                <th>Project</th>
                                <th>Employee</th>
                                <th>Deadline</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(t => (
                                <tr key={t.id}>
                                    <td style={{ fontWeight: 600 }}>{t.task_title}</td>
                                    <td>{t.project_name}</td>
                                    <td>{t.employee_name}</td>
                                    <td>{t.deadline}</td>
                                    <td>
                                        <span className={`teamlead-status-badge status-${t.status.toLowerCase().replace(' ', '-')}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="teamlead-modal">
                    <div className="teamlead-modal-content">
                        <h3>Assign Task</h3>
                        <form onSubmit={handleCreateTask}>
                            <div className="teamlead-form-field">
                                <label>Project</label>
                                <select required value={newTask.project} onChange={e => setNewTask({...newTask, project: e.target.value})}>
                                    <option value="">Select Project</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="teamlead-form-field">
                                <label>Employee</label>
                                <select required value={newTask.employee} onChange={e => setNewTask({...newTask, employee: e.target.value})}>
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.username}</option>)}
                                </select>
                            </div>
                            <div className="teamlead-form-field">
                                <label>Task Title</label>
                                <input type="text" required value={newTask.task_title} onChange={e => setNewTask({...newTask, task_title: e.target.value})} placeholder="e.g. Backend API Development" />
                            </div>
                            <div className="teamlead-form-field">
                                <label>Description</label>
                                <textarea required rows="3" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Describe the task..."></textarea>
                            </div>
                            <div className="teamlead-form-field">
                                <label>Deadline</label>
                                <input type="date" required value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
                            </div>
                            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                                <button type="submit" className="teamlead-btn teamlead-btn-primary">Assign Task</button>
                                <button type="button" className="teamlead-btn" style={{ background: '#eee', color: '#333' }} onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </TeamLeadLayout>
    );
};

export default TeamLeadTaskManagement;

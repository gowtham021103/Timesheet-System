import React, { useState, useEffect } from 'react';
import ManagerLayout from '../components/ManagerLayout';
import axios from 'axios';

const TeamLeads = () => {
    const [projects, setProjects] = useState([]);
    const [leads, setLeads] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentAssign, setCurrentAssign] = useState({ project: '', team_lead: '' });

    const fetchData = async () => {
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token') || '';
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const pRes = await axios.get(`http://127.0.0.1:8001/api/manager/projects/?user_id=${userId}`, { headers });
            const lRes = await axios.get('http://127.0.0.1:8001/api/teamleads/', { headers });
            
            setProjects(pRes.data);
            setLeads(lRes.data);
            setAssignments(pRes.data.filter(p => p.team_lead)); // Use projects that have a team lead assigned
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token') || '';
        try {
            await axios.post('http://127.0.0.1:8001/api/assign-teamlead/', {
                project_id: currentAssign.project,
                teamlead_id: currentAssign.team_lead
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            fetchData();
        } catch (err) {
            alert("Error assigning lead: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <ManagerLayout title="Team Leads Management">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <button className="manager-btn manager-btn-primary" onClick={() => setShowModal(true)}>Assign Team Lead</button>
            </div>

            <div className="manager-table-container">
                {assignments.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#666', fontSize: '1rem' }}>
                        No projects assigned to you yet.
                    </div>
                ) : (
                    <table className="manager-table">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Assigned Team Lead</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map(p => {
                                const matchedLead = leads.find(l => l.id === p.team_lead);
                                return (
                                    <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td style={{ fontWeight: 600 }}>{matchedLead ? matchedLead.username : 'Unknown'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="manager-modal">
                    <div className="manager-modal-content">
                        <h3>Assign Team Lead</h3>
                        <form onSubmit={handleAssign}>
                            <div className="manager-form-field">
                                <label>Project</label>
                                <select required onChange={e => setCurrentAssign({...currentAssign, project: e.target.value})}>
                                    <option value="">Select Project...</option>
                                    {projects.length === 0 ? (
                                        <option value="" disabled>No projects assigned to you yet.</option>
                                    ) : (
                                        projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                                    )}
                                </select>
                            </div>
                            <div className="manager-form-field">
                                <label>Team Lead</label>
                                <select required onChange={e => setCurrentAssign({...currentAssign, team_lead: e.target.value})}>
                                    <option value="">Select Team Lead...</option>
                                    {leads.length === 0 ? (
                                        <option value="" disabled>No team leads available.</option>
                                    ) : (
                                        leads.map(l => <option key={l.id} value={l.id}>{l.username}</option>)
                                    )}
                                </select>
                            </div>
                            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                                <button type="submit" className="manager-btn manager-btn-primary">Save Assignment</button>
                                <button type="button" className="manager-btn" style={{ background: '#eee', color: '#333' }} onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ManagerLayout>
    );
};

export default TeamLeads;

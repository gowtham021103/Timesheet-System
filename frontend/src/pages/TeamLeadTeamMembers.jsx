import React, { useState, useEffect } from 'react';
import TeamLeadLayout from '../components/TeamLeadLayout';
import axios from 'axios';

const TeamLeadTeamMembers = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const userId = localStorage.getItem('id');
            const token = localStorage.getItem('token') || '';
            try {
                const res = await axios.get(`http://127.0.0.1:8001/api/teamlead/employees/?user_id=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployees(res.data);
            } catch (err) {
                console.error("Error fetching employees", err);
            }
        };
        fetchEmployees();
    }, []);

    return (
        <TeamLeadLayout title="Team Members">
            <div className="teamlead-table-container">
                {employees.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#666' }}>
                        No employees currently assigned to your team.
                    </div>
                ) : (
                    <table className="teamlead-table">
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Assigned Project</th>
                                <th>Task Count</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td style={{ fontWeight: 600 }}>{emp.username}</td>
                                    <td>{emp.assigned_project}</td>
                                    <td>{emp.task_count}</td>
                                    <td>
                                        <span className="teamlead-status-badge status-active">
                                            {emp.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </TeamLeadLayout>
    );
};

export default TeamLeadTeamMembers;

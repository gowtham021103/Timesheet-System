import React, { useState, useEffect } from 'react';
import ManagerLayout from '../components/ManagerLayout';
import axios from 'axios';

const Employees = () => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            const userId = localStorage.getItem('id');
            const res = await axios.get(`http://127.0.0.1:8001/api/teams/?role=manager&user_id=${userId}`);
            setTeams(res.data);
        };
        fetchTeams();
    }, []);

    return (
        <ManagerLayout title="Employees working under you">
            <div className="manager-table-container">
                <table className="manager-table">
                    <thead>
                        <tr>
                            <th>Manager</th>
                            <th>Team Lead</th>
                            <th>Employee</th>
                            <th>Project</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map(t => (
                            <tr key={t.id}>
                                <td style={{ color: '#666' }}>{t.manager_name}</td>
                                <td style={{ fontWeight: 600 }}>{t.team_lead_name}</td>
                                <td style={{ fontWeight: 600, color: 'var(--manager-primary)' }}>{t.employee_name}</td>
                                <td>{t.project_name}</td>
                            </tr>
                        ))}
                        {teams.length === 0 && (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>No employees assigned under your supervision yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </ManagerLayout>
    );
};

export default Employees;

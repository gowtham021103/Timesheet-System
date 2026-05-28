import React, { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import axios from 'axios';

const TeamMembers = () => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            const res = await axios.get(`http://127.0.0.1:8001/api/teams/`); 
            // Simplified: in real app, filter for client projects
            setTeams(res.data);
        };
        fetchTeams();
    }, []);

    return (
        <ClientLayout title="Team Members">
            <div className="client-table-container">
                <table className="client-table">
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
        </ClientLayout>
    );
};

export default TeamMembers;

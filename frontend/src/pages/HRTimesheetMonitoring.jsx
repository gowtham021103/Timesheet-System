import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRHeader from '../components/HRHeader';

const HRTimesheetMonitoring = () => {
    const [timesheets, setTimesheets] = useState([]);

    useEffect(() => {
        const fetchTimesheets = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8001/api/hr/timesheets-monitor/');
                setTimesheets(response.data);
            } catch (error) {
                console.error('Error fetching timesheets:', error);
            }
        };
        fetchTimesheets();
    }, []);

    return (
        <div>
            <HRHeader title="Timesheet Monitoring" />
            
            <div className="hr-table-card">
                <table className="hr-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Project</th>
                            <th>Date</th>
                            <th>Hours</th>
                            <th>Status</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timesheets.map(ts => (
                            <tr key={ts.id}>
                                <td>{ts.username}</td>
                                <td>{ts.project_name}</td>
                                <td>{ts.date}</td>
                                <td>{ts.hours} hrs</td>
                                <td>
                                    <span className={`status-badge status-${ts.status.toLowerCase()}`}>
                                        {ts.status}
                                    </span>
                                </td>
                                <td>{ts.description || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HRTimesheetMonitoring;

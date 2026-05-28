import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRHeader from '../components/HRHeader';

const HRAttendance = () => {
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8001/api/hr/attendance/');
                setAttendance(response.data);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            }
        };
        fetchAttendance();
    }, []);

    return (
        <div>
            <HRHeader title="Attendance Logs" />
            
            <div className="hr-table-card">
                <table className="hr-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Project</th>
                            <th>Hours Worked</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map(record => (
                            <tr key={record.id}>
                                <td>{record.username}</td>
                                <td>{record.date}</td>
                                <td>{record.project_name}</td>
                                <td>{record.hours} hrs</td>
                                <td>
                                    <span className={`status-badge status-${record.status.toLowerCase()}`}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HRAttendance;

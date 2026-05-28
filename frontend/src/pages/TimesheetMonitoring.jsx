import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import axios from 'axios';

const TimesheetMonitoring = () => {
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    const fetchTimesheets = async () => {
      const res = await axios.get('http://127.0.0.1:8001/api/timesheets/');
      setTimesheets(res.data);
    };
    fetchTimesheets();
  }, []);

  return (
    <AdminLayout title="Timesheet Monitoring">
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Project</th>
              <th>Date</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map(t => (
              <tr key={t.id}>
                <td>{t.username}</td>
                <td>{t.project_name}</td>
                <td>{t.date}</td>
                <td>{t.hours}</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    backgroundColor: t.status === 'Approved' ? '#ecfdf3' : t.status === 'Pending' ? '#fffaeb' : '#fef3f2',
                    color: t.status === 'Approved' ? '#027a48' : t.status === 'Pending' ? '#b54708' : '#b42318'
                  }}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default TimesheetMonitoring;

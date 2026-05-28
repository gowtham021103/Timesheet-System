import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeTimesheetHistory = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        const res = await axios.get(`http://127.0.0.1:8001/api/employee/timesheets/?user_id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTimesheets(res.data);
      } catch (err) {
        console.error("Error fetching timesheets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimesheets();
  }, []);

  if (loading) return <div>Loading timesheet history...</div>;

  return (
    <div>
      <div className="employee-page-header">
        <h1 className="employee-page-title">Timesheet History</h1>
      </div>

      <div className="employee-card">
        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Hours Worked</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>
                    No timesheets submitted yet.
                  </td>
                </tr>
              ) : (
                timesheets.map(ts => (
                  <tr key={ts.id}>
                    <td style={{ fontWeight: 500 }}>{ts.date}</td>
                    <td>{ts.project_name}</td>
                    <td>{ts.hours}</td>
                    <td>{ts.description ? ts.description.substring(0, 50) + '...' : '-'}</td>
                    <td>
                      <span className={`employee-badge ${ts.status.toLowerCase()}`}>
                        {ts.status}
                      </span>
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

export default EmployeeTimesheetHistory;

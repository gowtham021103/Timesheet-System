import React from 'react';

const TimesheetTable = ({ timesheets }) => {
  return (
    <div className="client-table-container">
      <table className="client-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Project</th>
            <th>Date</th>
            <th>Hours Worked</th>
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
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimesheetTable;

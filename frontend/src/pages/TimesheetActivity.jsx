import React, { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import TimesheetTable from '../components/TimesheetTable';
import axios from 'axios';

const TimesheetActivity = () => {
    const [timesheets, setTimesheets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const role = localStorage.getItem('role');
            const userId = localStorage.getItem('id');
            const res = await axios.get(`http://127.0.0.1:8001/api/timesheets/?role=${role}&user_id=${userId}`);
            setTimesheets(res.data);
        };
        fetchData();
    }, []);

    return (
        <ClientLayout title="Timesheet Activity">
            <TimesheetTable timesheets={timesheets} />
        </ClientLayout>
    );
};

export default TimesheetActivity;

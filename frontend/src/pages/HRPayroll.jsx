import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRHeader from '../components/HRHeader';

const HRPayroll = () => {
    const [payroll, setPayroll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchPayrollData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8001/api/hr/payroll/');
            setPayroll(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching payroll:', err);
            setError('Failed to load payroll data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayrollData();
    }, []);

    const handleProcessPayment = async (employeeId) => {
        try {
            const response = await axios.post('http://127.0.0.1:8001/api/hr/process-payment/', {
                employee_id: employeeId
            });
            setSuccessMessage(response.data.message);
            // Dynamic refresh after payment
            fetchPayrollData();
            
            // Clear message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to process payment';
            alert(errorMsg);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': case 'Paid': return '#166534';
            case 'Pending Approval': case 'Eligible': return '#854d0e';
            case 'No Data': case 'Not Eligible': return '#991b1b';
            default: return '#475569';
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case 'Approved': case 'Paid': return '#dcfce7';
            case 'Pending Approval': case 'Eligible': return '#fef9c3';
            case 'No Data': case 'Not Eligible': return '#fee2e2';
            default: return '#f1f5f9';
        }
    };

    return (
        <div>
            <HRHeader title="Payroll Management" />
            
            <div className="hr-table-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h3>Dynamic Payroll System</h3>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>Real-time salary calculation based on live approved timesheets.</p>
                    </div>
                    <button 
                        className="hr-submit-btn" 
                        style={{ width: 'auto', padding: '8px 15px', background: '#0ea5e9' }}
                        onClick={fetchPayrollData}
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>

                {successMessage && (
                    <div style={{ padding: '10px 15px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>
                        ✓ {successMessage}
                    </div>
                )}

                {error && (
                    <div style={{ padding: '10px 15px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>
                        ⚠ {error}
                    </div>
                )}
                
                <table className="hr-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Cycle</th>
                            <th style={{ textAlign: 'center' }}>Approved Hours</th>
                            <th style={{ textAlign: 'center' }}>Hourly Rate</th>
                            <th style={{ textAlign: 'center' }}>Calculated Salary</th>
                            <th style={{ textAlign: 'center' }}>Timesheet Status</th>
                            <th style={{ textAlign: 'center' }}>Payment Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payroll.length === 0 && !loading ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                    No employee data found.
                                </td>
                            </tr>
                        ) : (
                            payroll.map((item) => (
                                <tr key={item.employee_id}>
                                    <td style={{ fontWeight: '600' }}>{item.employee_name}</td>
                                    <td>{item.month}</td>
                                    <td style={{ textAlign: 'center' }}>{item.total_hours} hrs</td>
                                    <td style={{ textAlign: 'center' }}>${item.hourly_rate}/hr</td>
                                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#0f172a' }}>
                                        ${item.salary.toLocaleString()}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{ 
                                            padding: '4px 10px', 
                                            borderRadius: '20px', 
                                            fontSize: '11px', 
                                            fontWeight: '600',
                                            background: getStatusBg(item.timesheet_status),
                                            color: getStatusColor(item.timesheet_status)
                                        }}>
                                            {item.timesheet_status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{ 
                                            padding: '4px 10px', 
                                            borderRadius: '20px', 
                                            fontSize: '11px', 
                                            fontWeight: '600',
                                            background: getStatusBg(item.payment_status),
                                            color: getStatusColor(item.payment_status)
                                        }}>
                                            {item.payment_status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button 
                                            className="hr-submit-btn" 
                                            style={{ 
                                                width: 'auto', 
                                                padding: '6px 12px', 
                                                fontSize: '12px',
                                                opacity: (item.salary === 0 || item.payment_status === 'Paid') ? 0.5 : 1,
                                                cursor: (item.salary === 0 || item.payment_status === 'Paid') ? 'not-allowed' : 'pointer'
                                            }}
                                            onClick={() => handleProcessPayment(item.employee_id)}
                                            disabled={item.salary === 0 || item.payment_status === 'Paid'}
                                        >
                                            {item.payment_status === 'Paid' ? 'Processed' : 'Process Payment'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {!loading && payroll.length > 0 && (
                    <div style={{ marginTop: '20px', fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>
                        * Salary is automatically calculated: (Approved Hours × Hourly Rate)
                    </div>
                )}
            </div>
        </div>
    );
};

export default HRPayroll;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeMessages = () => {
  const [teamLead, setTeamLead] = useState(null);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamLead = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        // A hack to find the team lead: look at the first assigned project
        const res = await axios.get(`http://127.0.0.1:8001/api/employee/projects/?user_id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.length > 0) {
          setTeamLead({
            id: res.data[0].team_lead,
            name: res.data[0].team_lead_name
          });
        }
      } catch (err) {
        console.error("Error fetching team lead:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamLead();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !teamLead) return;

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      await axios.post(`http://127.0.0.1:8001/api/messages/?user_id=${userId}`, {
        receiver: teamLead.id,
        message: message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setHistory([...history, { text: message, timestamp: new Date().toLocaleString() }]);
      setMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="employee-page-header">
        <h1 className="employee-page-title">Messages</h1>
      </div>

      <div className="employee-form-container" style={{ maxWidth: '800px' }}>
        <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>
          Contact Team Lead: {teamLead ? teamLead.name : 'Unknown'}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
          <div className="employee-form-group">
            <textarea 
              className="employee-form-control" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Type your message here..."
              required
            />
          </div>
          <button type="submit" className="employee-btn" disabled={!teamLead}>
            Send Message
          </button>
        </form>

        {history.length > 0 && (
          <div>
            <h4 style={{ marginBottom: '16px', color: '#475569', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Sent Messages (Current Session)</h4>
            <div className="employee-message-list">
              {history.map((msg, index) => (
                <div key={index} className="employee-message-card">
                  <div className="employee-message-header">
                    <span>To: {teamLead.name}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className="employee-message-content">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeMessages;

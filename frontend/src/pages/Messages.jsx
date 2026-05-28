import React, { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import axios from 'axios';

const Messages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('http://127.0.0.1:8001/api/messages/');
            setMessages(res.data);
        };
        fetchData();
    }, []);

    return (
        <ClientLayout title="Communication">
            <div style={{ display: 'grid', gap: '16px' }}>
                {messages.length === 0 && <p>No messages yet. Send an update to the manager.</p>}
                {messages.map(m => (
                    <div key={m.id} className="client-stat-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <strong>{m.sender_name}</strong>
                            <span style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(m.timestamp).toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: '1rem', color: '#444' }}>{m.content}</p>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '32px', background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #ddd' }}>
                <h3>Send a Message</h3>
                <textarea 
                    placeholder="Type your message to the manager or team lead..." 
                    style={{ width: '100%', minHeight: '100px', marginTop: '16px', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}
                />
                <button className="client-btn client-btn-primary" style={{ marginTop: '16px' }}>Send Message</button>
            </div>
        </ClientLayout>
    );
};

export default Messages;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import '../styles/LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await login(username, password);
            const role = data.role;
            localStorage.setItem('role', role);
            localStorage.setItem('username', data.username);
            localStorage.setItem('user_id', data.id);
            localStorage.setItem('id', data.id);

            switch (role) {
                case 'admin':
                    navigate('/admin-dashboard');
                    break;
                case 'client':
                    navigate('/client-dashboard');
                    break;
                case 'hr':
                    navigate('/hr-dashboard');
                    break;
                case 'teamlead':
                    navigate('/teamlead-dashboard');
                    break;
                case 'employee':
                    navigate('/employee-dashboard');
                    break;
                case 'manager':
                    navigate('/manager-dashboard');
                    break;
                default:
                    setError('Unknown role');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Sign In</h2>
                <p className="login-subtitle">Welcome back! Please enter your details.</p>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Signing in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

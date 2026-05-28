import axios from 'axios';

const API_URL = 'http://127.0.0.1:8001/api/';

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}login/`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Login failed');
        }
        throw new Error('Network error. Please try again.');
    }
};

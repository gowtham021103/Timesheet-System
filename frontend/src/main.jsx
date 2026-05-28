import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Global Axios Interceptor to replace hardcoded local backend URLs with environment/production URL
axios.interceptors.request.use((config) => {
  let backendUrl = import.meta.env.VITE_API_URL;
  
  if (!backendUrl) {
    // If VITE_API_URL is not set at build time, dynamically detect the environment at runtime
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.startsWith('192.168.');
                    
    backendUrl = isLocal ? 'http://127.0.0.1:8001' : 'https://timesheet-system-ray0.onrender.com';
  }

  if (config.url && config.url.startsWith('http://127.0.0.1:8001')) {
    config.url = config.url.replace('http://127.0.0.1:8001', backendUrl);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import axios from 'axios';

// ---------------------------------------------------------
// 1. POINT THIS TO YOUR LARAVEL RAILWAY URL
// ---------------------------------------------------------
const API_BASE_URL = 'https://pw-uas-laravel-production.up.railway.app'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  // Add these headers to ensure Laravel accepts the requests properly
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ---------------------------------------------------------
// 2. ATTACH TOKEN AUTOMATICALLY (Keep this logic)
// ---------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;  
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to headers if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const activeToken = token || user?.token;
  
  console.log('Sending request to:', req.url, 'with token:', activeToken ? 'TOKEN_EXISTS' : 'NO_TOKEN');
  
  if (activeToken) {
    req.headers.Authorization = `Bearer ${activeToken}`;
  }
  return req;
});


export default API;

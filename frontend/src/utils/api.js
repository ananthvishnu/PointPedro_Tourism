import axios from 'axios';

const getApiBaseURL = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Use the same hostname as the frontend for mobile compatibility
  const { hostname, protocol } = window.location;
  return `${protocol}//${hostname}:5000/api`;
};

const api = axios.create({
  baseURL: getApiBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('batti_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('batti_token');
      localStorage.removeItem('batti_user');
    }
    return Promise.reject(err);
  }
);

export default api;

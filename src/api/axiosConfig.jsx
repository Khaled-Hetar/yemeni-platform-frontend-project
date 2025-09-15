import axios from 'axios';

const apiClient = axios.create({
  // baseURL: 'http://localhost:3000',
   baseURL: '/api',
  // baseURL: "http://127.0.0.1:5000",
    // baseURL: import.meta.env.VITE_API_URL, // تأكد من أن هذا السطر موجود هكذا بالضبط
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true, // هذا السطر مهم جداً لـ Sanctum
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

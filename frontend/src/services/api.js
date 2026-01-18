import axios from 'axios';

const getBaseUrl = () => {
    const host = window.location.hostname;
    // If running on localhost, use localhost:8080
    // If running on LAN IP (e.g., 192.168.x.x), use that IP:8080
    return `http://${host}:8080/api`;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true, // Important for Session Cookies
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            // Redirect to login if session expired
            if (!window.location.pathname.includes('/login') && !window.location.pathname.startsWith('/ping')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

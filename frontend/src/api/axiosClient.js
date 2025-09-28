import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        Accept: 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser set the Content-Type for FormData.
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
});

export default axiosClient;
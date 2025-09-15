import axios from 'axios';

// Membuat instance axios dengan konfigurasi dasar
const axiosClient = axios.create({
    // PERBAIKAN: URL harus berupa string biasa tanpa format Markdown.
    baseURL: 'http://127.0.0.1:8000/api', 
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

export default axiosClient;

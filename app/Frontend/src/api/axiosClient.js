import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3069/api', // Port của Backend + /api prefix
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để gắn Token vào mỗi request nếu có
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor xử lý lỗi response
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Nếu token hết hạn hoặc invalid cho các request bảo mật, xóa và redirect về login.
        // Với request /auth/login, để trang login xử lý lỗi 401 và không reload.
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;

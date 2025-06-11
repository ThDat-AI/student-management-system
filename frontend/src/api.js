import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Đảm bảo bạn có biến này trong file .env
});

// Biến để ngăn chặn việc gọi refresh token liên tục
let isRefreshing = false;
// Mảng để lưu lại các request bị lỗi 401 trong khi đang refresh token
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // --- LOGIC QUAN TRỌNG NHẤT NẰM Ở ĐÂY ---
    // 1. Nếu lỗi không phải 401, hoặc lỗi 401 đến từ chính trang refresh token, hoặc request đã được thử lại rồi -> từ chối ngay
    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 2. Bỏ qua việc refresh nếu lỗi 401 đến từ trang đăng nhập
    if (originalRequest.url.includes('/token/')) {
        return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise(function(resolve, reject) {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    // 3. Kiểm tra xem có refresh token không trước khi gọi API
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
        console.log("Không có refresh token, đang đăng xuất.");
        // Chuyển hướng người dùng về trang đăng nhập
        // window.location.href = '/login';
        isRefreshing = false;
        return Promise.reject(error);
    }

    try {
      const rs = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = rs.data;
      localStorage.setItem(ACCESS_TOKEN, access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      originalRequest.headers['Authorization'] = `Bearer ${access}`;
      
      processQueue(null, access);
      return api(originalRequest);

    } catch (_error) {
      processQueue(_error, null);
      console.log("Refresh token đã hết hạn, đang đăng xuất.");
      localStorage.clear();
      // Chuyển hướng người dùng về trang đăng nhập
      window.location.href = '/login';
      return Promise.reject(_error);

    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
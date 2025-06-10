import axios from "axios";
import CONFIG from "../config";

const API_BASE_URL = `${CONFIG.BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // ❌ Xóa dòng này vì token chưa định nghĩa
    // Authorization: `Bearer ${token}`
  },
});

// ✅ Thêm token vào headers bằng interceptor
api.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("token");
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }
  return config;
});

// ✅ Xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // Only redirect to login if the user is on a protected route
      const protectedRoutes = ["/favorite", "/profile", "/edit-profile"];
      const isProtected = protectedRoutes.some(route => window.location.pathname.startsWith(route));
      if (isProtected && !window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

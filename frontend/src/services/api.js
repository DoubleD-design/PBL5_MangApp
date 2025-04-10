import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

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
  const jwt =
    "eyJhbGciOiJIUzI1NiJ9.e30.BMrZ0PRF_-9azvcMMOuEKSX6YFKtuf-e5WUrVHmm0P4";
  if (jwt) {
    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiJ9.e30.BMrZ0PRF_-9azvcMMOuEKSX6YFKtuf-e5WUrVHmm0P4`;
  }
  return config;
});

// ✅ Xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

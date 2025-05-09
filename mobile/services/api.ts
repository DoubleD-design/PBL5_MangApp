import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Thêm token vào headers bằng interceptor (đúng cách)
api.interceptors.request.use(
  async (config) => {
    const jwt = await AsyncStorage.getItem("token");
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Xử lý lỗi 401 (nếu cần)
// Bạn nên chuyển việc điều hướng sang nơi khác có quyền gọi navigation
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      AsyncStorage.removeItem("token");
      // Navigation xử lý redirect, đừng dùng window.location trong React Native
    }
    return Promise.reject(error);
  }
);

export default api;

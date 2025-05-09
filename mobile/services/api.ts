import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = "http://10.0.2.2:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Thêm token vào headers bằng interceptor (đúng cách)
api.interceptors.request.use(
  async (config) => {
    // Debug: log xem URL và header
    console.log("Request URL:", config.url);
    const jwt = await AsyncStorage.getItem("token");
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
      console.log("Token Added to Headers:", jwt); // Debug: log token
    } else {
      console.log("No token found"); // Debug: log nếu không có token
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error); // Debug: log lỗi khi gửi request
    return Promise.reject(error);
  }
);

// ✅ Xử lý lỗi 401 (nếu cần)
// Bạn nên chuyển việc điều hướng sang nơi khác có quyền gọi navigation
api.interceptors.response.use(
  (response) => {
    console.log("Response Data:", response.data); // Debug: log dữ liệu response
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("Error Response Status:", error.response.status); // Debug: log status của lỗi
      console.log("Error Response Data:", error.response.data); // Debug: log dữ liệu lỗi trả về
      if (error.response.status === 401) {
        AsyncStorage.removeItem("token");
        console.log("Token removed due to 401 error");
      }
    } else {
      console.error("Network or other Error:", error.message); // Debug: log lỗi khác (như network)
    }
    return Promise.reject(error);
  }
);

export default api;

import api from "./api";
import CONFIG from "../config";
const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const user = response.data.user;
      localStorage.setItem("token", response.data.jwt);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // Dispatch a custom event to notify login
      window.dispatchEvent(new Event("user-logged-in"));
      console.log("Login successful, redirecting...");
      window.location.href = "/";
      return user;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      console.log("Registration successful, redirecting...");
      window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
      return response.data;
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  loginWithGoogle: () => {
    // Chuyển hướng trình duyệt tới endpoint OAuth2 của backend
    window.location.href = `${CONFIG.BACKEND_URL}${CONFIG.GOOGLE_AUTH_URL}`;
  },
  exchangeGoogleCodeForJwt: async (code, state) => {
    try {
      const response = await api.post("/auth/oauth2/callback", { code, state });
      localStorage.setItem("token", response.data.jwt);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.dispatchEvent(new Event("user-logged-in"));
      return response.data;
    } catch (error) {
      console.error("Exchange code for JWT failed:", error);
      throw error;
    }
  },
  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user"); // Remove invalid data
      return null;
    }
  },
  getAllUsers: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  lockUser: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/lock`);
      return response.data;
    } catch (error) {
      console.error("Error locking user:", error);
      throw error;
    }
  },

  unlockUser: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/unlock`);
      return response.data;
    } catch (error) {
      console.error("Error unlocking user:", error);
      throw error;
    }
  },

  banUser: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/ban`);
      return response.data;
    } catch (error) {
      console.error("Error banning user:", error);
      throw error;
    }
  },

  unbanUser: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/unban`);
      return response.data;
    } catch (error) {
      console.error("Error unbanning user:", error);
      throw error;
    }
  },

  setVipStatus: async (userId, status) => {
    try {
      const response = await api.post(`/users/${userId}/vip`, { status });
      return response.data;
    } catch (error) {
      console.error("Error setting VIP status:", error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem("token") !== null;
  },
};

export default authService;

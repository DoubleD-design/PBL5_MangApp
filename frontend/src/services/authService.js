import api from './api';

const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.jwt);
      // Dispatch a custom event to notify login
      window.dispatchEvent(new Event('user-logged-in'));
      console.log("Login successful, redirecting...");
      window.location.href = "/";
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  
};

export default authService;
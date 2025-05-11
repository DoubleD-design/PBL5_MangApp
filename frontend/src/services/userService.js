import api from './api';

const userService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/details', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Edit user profile
  editUserProfile: async (userData) => {
    try {
      const response = await api.put('/users/changeinfo', {
        ...userData,
        gender: userData.gender,
        birthday: userData.birthday,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user reading history
  getReadingHistory: async () => {
    try {
      const response = await api.get('/users/reading-history', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add manga to reading history
  addToReadingHistory: async (mangaId, chapterId) => {
    try {
      const response = await api.post(
        '/users/reading-history',
        { mangaId, chapterId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put('/users/changepassword', passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Password change failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update avatar
  updateAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.put('/users/avatar', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return response.data; // Return the new avatar URL
    } catch (error) {
      console.error("Error updating avatar:", error);
      throw error;
    }
  },
};

export default userService;
import api from './api';

const userService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile', {
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
      const response = await api.put('/users/changeinfo', userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
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
  }
};

export default userService;
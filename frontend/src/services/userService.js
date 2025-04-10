import api from './api';

const userService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userData) => {
    try {
      const response = await api.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user reading history
  getReadingHistory: async () => {
    try {
      const response = await api.get('/user/reading-history');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add manga to reading history
  addToReadingHistory: async (mangaId, chapterId) => {
    try {
      const response = await api.post('/reading-history', { mangaId, chapterId });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userService;
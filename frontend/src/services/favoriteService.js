import api from './api';

const favoriteService = {
  // Get user favorites
  getUserFavorites: async () => {
    try {
      const response = await api.get('/favourite');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add manga to favorites
  addToFavorites: async (mangaId) => {
    try {
      const response = await api.post('/favourite', { mangaId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove manga from favorites
  removeFromFavorites: async (mangaId) => {
    try {
      const response = await api.delete(`/favourite/${mangaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if manga is in favorites
  isFavorite: async (mangaId) => {
    try {
      const response = await api.get(`/favourite/check/${mangaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default favoriteService;
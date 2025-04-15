import api from "./api";
import authService from "./authService";

const favoriteService = {
  // Get user favorites
  getUserFavorites: async () => {
    try {
      const response = await api.get("/favourites");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add manga to favorites
  addToFavorites: async (mangaId) => {
    try {
      const response = await api.post("/favourites", { mangaId }); // không cần JSON.stringify
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove manga from favorites
  removeFromFavorites: async (mangaId) => {
    try {
      const response = await api.delete(`/favourites/${mangaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if manga is in favorites
  isFavorite: async (mangaId) => {
    try {
      const response = await api.get(`/favourites/check/${mangaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default favoriteService;

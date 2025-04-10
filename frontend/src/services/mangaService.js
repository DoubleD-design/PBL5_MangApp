import api from './api';

const mangaService = {
  // Get all mangas with pagination
  getAllMangas: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/manga?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get manga by ID
  getMangaById: async (id) => {
    try {
      const response = await api.get(`/manga/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get manga chapters
  getMangaChapters: async (mangaId) => {
    try {
      const response = await api.get(`/manga/${mangaId}/chapters`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get chapter details
  getChapterDetails: async (chapterId) => {
    try {
      const response = await api.get(`/chapter/${chapterId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get manga by category
  getMangasByCategory: async (categoryId, page = 0, size = 10) => {
    try {
      const response = await api.get(`/category/${categoryId}/manga?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get featured/popular mangas
  getFeaturedMangas: async () => {
    try {
      const response = await api.get('/manga/featured');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get latest updated mangas
  getLatestUpdates: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/manga/latest?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search mangas
  searchMangas: async (query, page = 0, size = 10) => {
    try {
      const response = await api.get(`/manga/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default mangaService;
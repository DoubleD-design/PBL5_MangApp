import api from "./api";

const mangaService = {
  // Get all mangas with pagination
  getAllMangas: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/manga?page=${page}&size=${size}`);
      console.log("API Response:", response.data);
      // Make sure we're returning the entire response data object
      // which should contain the content array with multiple manga items
      return response.data;
    } catch (error) {
      console.error("Error in getAllMangas:", error);
      throw error;
    }
  },

  // Get manga by ID
  getMangaById: async (id) => {
    try {
      const response = await api.get(`/manga/${id}`);
      return response.data;
    } catch (error) {
        console.error("Error in getMangaById:", error);
      throw error;
    }
  },

  // Get manga chapters
  getMangaChapters: async (mangaId, chapterNumber) => {
    try {
      // ✅ GỌI ĐÚNG QUA `api.get`, KHÔNG dùng `axios.get` trực tiếp
      const response = await api.get(
        `/chapters/manga/${mangaId}/chapter/${chapterNumber}`
      );
      return response.data;
    } catch (error) {
      console.error("Error in getMangaChapters:", error);
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
      const response = await api.get(
        `/category/${categoryId}/manga?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get featured/popular mangas
  getFeaturedMangas: async () => {
    try {
      const response = await api.get("/manga/featured");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get latest updated mangas
  getLatestUpdates: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/manga/latest?page=${page}&size=${size}`);
      const data = response.data;

      // Đảm bảo luôn trả ra mảng
      return Array.isArray(data.content) ? data : { content: [] };
    } catch (error) {
      console.error("API lỗi:", error);
      return { content: [] };
    }
  },

  // Search mangas
  searchMangas: async (query, page = 0, size = 10) => {
    try {
      const response = await api.get(
        `/manga/search?query=${encodeURIComponent(
          query
        )}&page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default mangaService;

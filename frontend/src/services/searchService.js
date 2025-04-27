import api from "./api";

const searchService = {
  searchManga: async (query, page = 0, size = 12, searchType = "title") => {
    try {
      const response = await api.get(`/manga/search`, {
        params: { query, page, size, type: searchType },
      });
      return response.data;
    } catch (error) {
      console.error("Search error:", error);
      throw error.response?.data || { message: "Failed to search manga" };
    }
  },
};

export default searchService;

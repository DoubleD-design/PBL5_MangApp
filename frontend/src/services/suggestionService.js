import api from "./api";

const suggestionService = {
  // Get suggested mangas for a user
  getSuggestedMangas: async (userId) => {
    try {
      const response = await api.get(`/suggestions/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching manga suggestions:", error);
      throw error;
    }
  },
};

export default suggestionService;
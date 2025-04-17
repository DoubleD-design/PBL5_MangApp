import axios from "axios";
import { API_BASE_URL } from "../config";

const searchService = {
  searchManga: async (query) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/manga/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to search manga" };
    }
  }
};

export default searchService;
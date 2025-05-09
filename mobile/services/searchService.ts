import api from "./api";

interface SearchResponse {
  // Define the expected structure of the response here
  // For example, if the response contains a list of manga:
  results: Array<{
    id: number;
    title: string;
    [key: string]: any; // Add more fields as per the response structure
  }>;
  total: number;
}

const searchService = {
  searchManga: async (
    query: string,
    page: number = 0,
    size: number = 12,
    searchType: "title" | "author" | "genre" = "title"
  ): Promise<SearchResponse> => {
    try {
      const response = await api.get("/manga/search", {
        params: { query, page, size, type: searchType },
      });
      return response.data;
    } catch (error: any) {
      console.error("Search error:", error);
      throw error.response?.data || { message: "Failed to search manga" };
    }
  },
};

export default searchService;

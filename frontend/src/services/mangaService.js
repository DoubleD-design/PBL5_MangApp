import api from "./api";

const mangaService = {
  // Upload file ảnh lên Azure Blob qua backend, trả về URL
  // uploadCoverImage: async (file) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   const response = await fetch("/api/manga/upload", {
  //     method: "POST",
  //     body: formData,
  //   });
  //   if (!response.ok) throw new Error("Upload failed");
  //   const data = await response.json();
  //   return data.url;
  // },

  // Create a new manga (multipart/form-data)
  createManga: async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/manga/create", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) throw new Error("Error creating manga");
      return await response.json();
    } catch (error) {
      console.error("Error creating manga:", error);
      throw error;
    }
  },

  // Update manga (multipart/form-data or JSON)
  updateManga: async (mangaId, formData, file) => {
    const form = new FormData();
    form.append("dataForm", JSON.stringify(formData));

    // Append the file only if it exists
    if (file) {
      form.append("image", file);
    }

    const res = await api.put(`/manga/update/${mangaId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Delete manga
  deleteManga: async (mangaId) => {
    try {
      const response = await api.delete(`/manga/delete/${mangaId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting manga:", error);
      throw error;
    }
  },

  // Update manga visibility
  // updateMangaVisibility: async (mangaId, visible) => {
  //   try {
  //     const response = await api.put(`/manga/${mangaId}/visibility`, {
  //       visible,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error updating manga visibility:", error);
  //     throw error;
  //   }
  // },

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

  // Get most viewed mangas
  getMostViewedMangas: async (limit = 7) => {
    try {
      const response = await api.get(`/manga/most-viewed?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error in getMostViewedMangas:", error);
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
      console.log(
        `Fetching mangas for category ID: ${categoryId}, page: ${page}, size: ${size}`
      );
      const response = await api.get(
        `/manga/categories/${categoryId}/manga?page=${page}&size=${size}`
      );
      console.log("API response for category mangas:", response);

      // If the API returns an empty array or no content property, format it properly
      if (Array.isArray(response.data)) {
        return {
          content: response.data,
          totalPages: 1,
        };
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching mangas for category ${categoryId}:`, error);
      // Return empty data structure instead of throwing to prevent UI crashes
      return {
        content: [],
        totalPages: 0,
      };
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

  // Increment manga view count
  incrementViews: async (mangaId) => {
    try {
      const response = await api.post(`/manga/${mangaId}/increment-views`);
      return response.data;
    } catch (error) {
      console.error("Error incrementing views:", error);
      // Silently fail - don't interrupt user experience for view counting
      return null;
    }
  },

  // Get ranked mangas by views with pagination
  getRankedMangas: async (page = 0, size = 12, limit = 40) => {
    try {
      const response = await api.get(
        `/manga/ranking?page=${page}&size=${size}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching ranked mangas:", error);
      throw error;
    }
  },

  // Submit or update a user's rating for a manga
  rateManga: async (mangaId, rating) => {
    try {
      const response = await api.post(`/ratings/add`, {
        mangaId: Number(mangaId),
        rating: Number(rating),
        userId: Number(localStorage.getItem("userId") || 1),
      });
      return response.data;
    } catch (error) {
      console.error("Error rating manga:", error);
      throw error;
    }
  },

  // Get the current user's rating for a manga
  getUserRating: async (mangaId) => {
    try {
      const response = await api.get(`/ratings/user-rating?mangaId=${mangaId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user rating:", error);
      return null;
    }
  },

  // Get all ratings for a manga (for calculating average, etc.)
  getMangaRatings: async (mangaId) => {
    try {
      const response = await api.get(`/ratings/manga/${mangaId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching manga ratings:", error);
      // Return empty array for any error, including authentication errors
      return [];
    }
  },

  // Get average rating for a manga
  getAverageRating: async (mangaId) => {
    try {
      const response = await api.get(`/ratings/manga/${mangaId}/average`);
      return response.data;
    } catch (error) {
      console.error("Error fetching average rating:", error);
      // Return 0 for any error, including authentication errors
      return 0;
    }
  },

};

export default mangaService;

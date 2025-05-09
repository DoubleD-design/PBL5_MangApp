import axios from "axios";
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Manga {
  id?: number;
  title: string;
  description?: string;
  // Thêm các trường khác tùy theo schema của bạn
}

interface Chapter {
  id: number;
  title: string;
  pages: string[];
}

interface PaginatedResponse<T> {
  content: T[];
  totalPages?: number;
}

const mangaService = {
  createManga: async (mangaData: Manga): Promise<Manga> => {
    const response = await api.post<Manga>("/manga", mangaData);
    return response.data;
  },

  getAllMangas: async (page = 0, size = 10): Promise<PaginatedResponse<Manga>> => {
    const response = await api.get<PaginatedResponse<Manga>>(`/manga?page=${page}&size=${size}`);
    return response.data;
  },

  getMostViewedMangas: async (limit = 7): Promise<Manga[]> => {
    const response = await api.get<Manga[]>(`/manga/most-viewed?limit=${limit}`);
    return response.data;
  },

  getMangaById: async (id: number): Promise<Manga> => {
    const response = await api.get<Manga>(`/manga/${id}`);
    return response.data;
  },

  getMangaChapters: async (mangaId: number, chapterNumber: number): Promise<Chapter> => {
    const response = await api.get<Chapter>(`/chapters/manga/${mangaId}/chapter/${chapterNumber}`);
    return response.data;
  },

  getChapterDetails: async (chapterId: number): Promise<Chapter> => {
    const response = await api.get<Chapter>(`/chapter/${chapterId}`);
    return response.data;
  },

  getMangasByCategory: async (categoryId: number, page = 0, size = 10): Promise<PaginatedResponse<Manga>> => {
    const response = await api.get<any>(`/manga/categories/${categoryId}/manga?page=${page}&size=${size}`);
    if (Array.isArray(response.data)) {
      return { content: response.data, totalPages: 1 };
    }
    return response.data;
  },

  getFeaturedMangas: async (): Promise<Manga[]> => {
    const response = await api.get<Manga[]>("/manga/featured");
    return response.data;
  },

  getLatestUpdates: async (page = 0, size = 10): Promise<PaginatedResponse<Manga>> => {
    const response = await api.get<PaginatedResponse<Manga>>(`/manga/latest?page=${page}&size=${size}`);
    return Array.isArray(response.data.content) ? response.data : { content: [] };
  },

  searchMangas: async (query: string, page = 0, size = 10): Promise<PaginatedResponse<Manga>> => {
    const response = await api.get<PaginatedResponse<Manga>>(`/manga/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);
    return response.data;
  },

  incrementViews: async (mangaId: number): Promise<null | any> => {
    try {
      const response = await api.post(`/manga/${mangaId}/increment-views`);
      return response.data;
    } catch {
      return null;
    }
  },

  getRankedMangas: async (page = 0, size = 12, limit = 40): Promise<PaginatedResponse<Manga>> => {
    const response = await api.get<PaginatedResponse<Manga>>(`/manga/ranking?page=${page}&size=${size}&limit=${limit}`);
    return response.data;
  },

  rateManga: async (mangaId: number, rating: number): Promise<any> => {
    const response = await api.post(`/ratings/add`, {
      mangaId,
      rating,
      userId: Number(AsyncStorage.getItem("userId") || 1),
    });
    return response.data;
  },

  getUserRating: async (mangaId: number): Promise<number | null> => {
    try {
      const response = await api.get<number>(`/ratings/user-rating?mangaId=${mangaId}`);
      return response.data;
    } catch {
      return null;
    }
  },

  getMangaRatings: async (mangaId: number): Promise<number[]> => {
    try {
      const response = await api.get<number[]>(`/ratings/manga/${mangaId}`);
      return response.data;
    } catch {
      return [];
    }
  },

  getAverageRating: async (mangaId: number): Promise<number> => {
    try {
      const response = await api.get<number>(`/ratings/manga/${mangaId}/average`);
      return response.data;
    } catch {
      return 0;
    }
  },

  updateManga: async (mangaId: number, mangaData: Manga): Promise<Manga> => {
    const response = await api.put<Manga>(`/manga/${mangaId}`, mangaData);
    return response.data;
  },

  deleteManga: async (mangaId: number): Promise<any> => {
    const response = await api.delete(`/manga/${mangaId}`);
    return response.data;
  },

  updateMangaVisibility: async (mangaId: number, visible: boolean): Promise<any> => {
    const response = await api.put(`/manga/${mangaId}/visibility`, { visible });
    return response.data;
  },
};

export default mangaService;

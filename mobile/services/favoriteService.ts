import api from "./api";

export interface Favorite {
  id: number;
  userId: number;
  mangaId: number;
  createdAt?: string;
  [key: string]: any;
}

const favoriteService = {
  getUserFavorites: async (): Promise<Favorite[]> => {
    try {
      const response = await api.get("/favourites");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  addToFavorites: async (mangaId: number): Promise<Favorite> => {
    try {
      const response = await api.post("/favourites", { mangaId });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  removeFromFavorites: async (mangaId: number): Promise<{ success: boolean }> => {
    try {
      const response = await api.delete(`/favourites/manga/${mangaId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};

export default favoriteService;

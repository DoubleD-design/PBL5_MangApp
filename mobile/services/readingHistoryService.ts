import api from "./api";
import authService from "./authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const READING_HISTORY_KEY = "manga_reading_history";

interface ReadingHistoryItem {
  mangaId: number;
  chapterId: number;
  chapterNumber: number;
  timestamp: string;
}

interface User {
  id: number;
}

const readingHistoryService = {
  // Get reading history for current user (authenticated or not)
  getReadingHistory: async (): Promise<ReadingHistoryItem[]> => {
    try {
      // For authenticated users, get from API
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        if (user && (await user).id) {
          const response = await api.get(`/reading-history/user/${(await user).id}`);
          return response.data;
        } else {
          console.log("Using local storage only - user ID not available");
          // Fallback to localStorage if user ID is not available
          const history = await AsyncStorage.getItem(READING_HISTORY_KEY);
          return history ? JSON.parse(history) : [];
        }
      } else {
        // For non-authenticated users, get from localStorage
        const history = await AsyncStorage.getItem(READING_HISTORY_KEY);
        return history ? JSON.parse(history) : [];
      }
    } catch (error) {
      console.error("Error getting reading history:", error);
      // Fallback to localStorage if API fails
      const history = await AsyncStorage.getItem(READING_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    }
  },

  // Add chapter to reading history
  addToReadingHistory: async (
    mangaId: number,
    chapterId: number,
    chapterNumber: number,
    lastReadPage: number = 1
  ): Promise<boolean> => {
    try {
      const historyItem: ReadingHistoryItem = {
        mangaId: parseInt(mangaId.toString()),
        chapterId: parseInt(chapterId.toString()),
        chapterNumber,
        timestamp: new Date().toISOString(),
      };

      // For authenticated users, save to API
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        if (user && (await user).id) {
          const apiPayload = {
            userId: (await user).id,
            mangaId: parseInt(mangaId.toString()),
            chapterId: parseInt(chapterId.toString()),
            lastReadPage,
          };
          await api.post("/reading-history", apiPayload);
        } else {
          console.log("Using local storage only - user ID not available");
        }
      }

      // Always save to localStorage as backup and for non-authenticated users
      const history = await localStorage.getItem(READING_HISTORY_KEY);
      let historyArray = history ? JSON.parse(history) : [];

      // Remove any existing entry for this chapter to avoid duplicates
      historyArray = historyArray.filter(
        (item: ReadingHistoryItem) =>
          !(item.mangaId === historyItem.mangaId && item.chapterId === historyItem.chapterId)
      );

      // Add new entry
      historyArray.push(historyItem);

      // Limit history size to prevent localStorage from getting too large
      if (historyArray.length > 100) {
        historyArray = historyArray.slice(-100);
      }

      await AsyncStorage.setItem(READING_HISTORY_KEY, JSON.stringify(historyArray));
      return true;
    } catch (error) {
      console.error("Error adding to reading history:", error);
      return false;
    }
  },

  // Check if a chapter has been read
  isChapterRead: async (mangaId: number, chapterId: number): Promise<boolean> => {
    try {
      const history = await readingHistoryService.getReadingHistory();
      return history.some(
        (item) =>
          item.mangaId === parseInt(mangaId.toString()) &&
          item.chapterId === parseInt(chapterId.toString())
      );
    } catch (error) {
      console.error("Error checking if chapter is read:", error);
      return false;
    }
  },

  // Get all read chapters for a specific manga
  getReadChaptersForManga: async (mangaId: number): Promise<ReadingHistoryItem[]> => {
    try {
      const history = await readingHistoryService.getReadingHistory();
      return history.filter((item) => item.mangaId === parseInt(mangaId.toString()));
    } catch (error) {
      console.error("Error getting read chapters for manga:", error);
      return [];
    }
  },

  // Clear reading history (for testing or user preference)
  clearReadingHistory: async (): Promise<boolean> => {
    try {
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        if (user && (await user).id) {
          await api.delete(`/reading-history/user/${(await user).id}`);
        } else {
          console.log("Using local storage only - user ID not available");
        }
      }
      // Always clear localStorage regardless of authentication status
      await AsyncStorage.removeItem(READING_HISTORY_KEY);
      return true;
    } catch (error) {
      console.error("Error clearing reading history:", error);
      return false;
    }
  },
};

export default readingHistoryService;

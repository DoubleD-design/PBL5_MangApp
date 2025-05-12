import api from "./api";
import authService from "./authService";

const READING_HISTORY_KEY = "manga_reading_history";

const readingHistoryService = {
  // Get reading history for current user (authenticated or not)
  getReadingHistory: async () => {
    try {
      // For authenticated users, get from API
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        if (user && user.id) {
          const response = await api.get(
            `/reading-history/user/${user.id}`
          );
          return response.data;
        } else {
          console.log("Using local storage only - user ID not available");
          // Fallback to localStorage if user ID is not available
          const history = localStorage.getItem(READING_HISTORY_KEY);
          return history ? JSON.parse(history) : [];
        }
      } else {
        // For non-authenticated users, get from localStorage
        const history = localStorage.getItem(READING_HISTORY_KEY);
        return history ? JSON.parse(history) : [];
      }
    } catch (error) {
      console.error("Error getting reading history:", error);
      // Fallback to localStorage if API fails
      const history = localStorage.getItem(READING_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    }
  },

  // Add chapter to reading history
  addToReadingHistory: async (
    mangaId,
    chapterId,
    chapterNumber,
    lastReadPage = 1
  ) => {
    try {
      const historyItem = {
        mangaId: parseInt(mangaId),
        chapterId: parseInt(chapterId),
        chapterNumber,
        lastReadPage, // Thêm trường này
        timestamp: new Date().toISOString(),
      };
  
      // For authenticated users
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        if (user?.id) {
          // Sử dụng endpoint mới tạo history thay vì update
          await api.post("/reading-history", {
            userId: user.id,
            mangaId: historyItem.mangaId,
            chapterId: historyItem.chapterId,
            lastReadPage: historyItem.lastReadPage // Thêm trường này
          });
        }
      }
  
      // Xử lý localStorage
      const history = localStorage.getItem(READING_HISTORY_KEY);
      let historyArray = history ? JSON.parse(history) : [];
      
      // Thêm mới mà không xóa entry cũ
      historyArray.unshift(historyItem); // Thêm vào đầu mảng
      
      // Giới hạn lịch sử
      if (historyArray.length > 100) {
        historyArray = historyArray.slice(0, 100);
      }
      
      localStorage.setItem(READING_HISTORY_KEY, JSON.stringify(historyArray));
      return true;
    } catch (error) {
      console.error("Error adding to reading history:", error);
      return false;
    }
  },

  // Check if a chapter has been read
  isChapterRead: async (mangaId, chapterId) => {
    try {
      const history = await readingHistoryService.getReadingHistory();
      return history.some(
        (item) =>
          item.mangaId === parseInt(mangaId) &&
          item.chapterId === parseInt(chapterId)
      );
    } catch (error) {
      console.error("Error checking if chapter is read:", error);
      return false;
    }
  },

  // Get all read chapters for a specific manga
  getReadChaptersForManga: async (mangaId) => {
    try {
      const history = await readingHistoryService.getReadingHistory();
      return history.filter((item) => item.mangaId === parseInt(mangaId));
    } catch (error) {
      console.error("Error getting read chapters for manga:", error);
      return [];
    }
  },

  // Clear reading history (for testing or user preference)
  clearReadingHistory: async () => {
    try {
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        if (user && user.id) {
          await api.delete(`/reading-history/user/${user.id}`);
        } else {
          console.log("Using local storage only - user ID not available");
          // Continue with localStorage only
        }
      }
      // Always clear localStorage regardless of authentication status
      localStorage.removeItem(READING_HISTORY_KEY);
      return true;
    } catch (error) {
      console.error("Error clearing reading history:", error);
      return false;
    }
  },
};

export default readingHistoryService;

import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  gender: string;
  birthday: string;
  vipStatus: boolean;
  // Add more fields if needed
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ReadingHistoryItem {
  mangaId: number;
  chapterId: number;
}

interface UserProfile {
  // Define the expected structure for the user profile response
  id: number;
  name: string;
  email: string;
  gender: string;
  birthday: string;
  vipStatus: boolean;
  avatarUrl: string;
  [key: string]: any; // Add more fields as per the response structure
}

const userService = {
  // Get user profile
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get('/users/details', {
        headers: { Authorization: `Bearer ${AsyncStorage.getItem('token')}` },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Edit user profile
  editUserProfile: async (userData: UserData): Promise<any> => {
    try {
      const response = await api.put(
        '/users/changeinfo',
        { ...userData, gender: userData.gender, birthday: userData.birthday },
        {
          headers: { Authorization: `Bearer ${AsyncStorage.getItem('token')}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId: number): Promise<UserProfile> => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Get user reading history
  getReadingHistory: async (): Promise<ReadingHistoryItem[]> => {
    try {
      const response = await api.get('/users/reading-history', {
        headers: { Authorization: `Bearer ${AsyncStorage.getItem('token')}` },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Add manga to reading history
  addToReadingHistory: async (mangaId: number, chapterId: number): Promise<any> => {
    try {
      const response = await api.post(
        '/users/reading-history',
        { mangaId, chapterId },
        { headers: { Authorization: `Bearer ${AsyncStorage.getItem('token')}` } }
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData: PasswordData): Promise<any> => {
    try {
      const token = AsyncStorage.getItem('token');
      const response = await api.put('/users/changepassword', passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      console.error('Password change failed:', error.response?.data || error.message);
      throw error;
    }
  },

  updateAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.put('/users/avatar', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return response.data; // Return the new avatar URL
    } catch (error: any) {
      console.error("Error updating avatar:", error);
      throw error;
    }
  },
};

export default userService;

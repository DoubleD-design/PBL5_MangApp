import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Credentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  // Thêm các trường khác nếu có
  [key: string]: any;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  // Thêm các trường khác nếu có
  [key: string]: any;
}

const authService = {
  login: async (credentials: Credentials): Promise<User> => {
    try {
      const response = await api.post("/auth/login", credentials);
      const user: User = response.data.user;
      await AsyncStorage.setItem("token", response.data.jwt);  // Dùng await cho setItem
      await AsyncStorage.setItem("user", JSON.stringify(user));  // Dùng await cho setItem
      window.dispatchEvent(new Event("user-logged-in"));
      console.log("Login successful, redirecting...");
      window.location.href = "/"; // Cần thay đổi sang cách xử lý redirect phù hợp trong React Native
      return user;
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  },

  register: async (userData: RegisterData): Promise<any> => {
    try {
      const response = await api.post("/auth/register", userData);
      console.log("Registration successful, redirecting...");
      window.location.href = "/login"; // Cần thay đổi sang cách xử lý redirect phù hợp trong React Native
      return response.data;
    } catch (error: any) {
      console.error("Registration failed:", error.response?.data || error.message);
      throw error;
    }
  },

  logout: (): void => {
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("user");
    window.location.href = "/login";  // Cần thay đổi sang cách xử lý redirect phù hợp trong React Native
  },

  getCurrentUser: async (): Promise<User | null> => {  // Đổi thành async
    try {
      const user = await AsyncStorage.getItem("user");  // Dùng await cho getItem
      if (!user) return null;
      return JSON.parse(user) as User;
    } catch (error) {
      console.error("Error parsing user data:", error);
      await AsyncStorage.removeItem("user");  // Dùng await cho removeItem
      return null;
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  lockUser: async (userId: number): Promise<any> => {
    try {
      const response = await api.post(`/users/${userId}/lock`);
      return response.data;
    } catch (error: any) {
      console.error("Error locking user:", error);
      throw error;
    }
  },

  unlockUser: async (userId: number): Promise<any> => {
    try {
      const response = await api.post(`/users/${userId}/unlock`);
      return response.data;
    } catch (error: any) {
      console.error("Error unlocking user:", error);
      throw error;
    }
  },

  banUser: async (userId: number): Promise<any> => {
    try {
      const response = await api.post(`/users/${userId}/ban`);
      return response.data;
    } catch (error: any) {
      console.error("Error banning user:", error);
      throw error;
    }
  },

  unbanUser: async (userId: number): Promise<any> => {
    try {
      const response = await api.post(`/users/${userId}/unban`);
      return response.data;
    } catch (error: any) {
      console.error("Error unbanning user:", error);
      throw error;
    }
  },

  setVipStatus: async (userId: number, status: boolean): Promise<any> => {
    try {
      const response = await api.post(`/users/${userId}/vip`, { status });
      return response.data;
    } catch (error: any) {
      console.error("Error setting VIP status:", error);
      throw error;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {  // Thêm async để xử lý bất đồng bộ
    const token = await AsyncStorage.getItem("token");  // Dùng await cho getItem
    return token !== null;
  },
};

export default authService;

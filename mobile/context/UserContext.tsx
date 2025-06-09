import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Định nghĩa kiểu cho thông tin người dùng (User)
interface User {
  id: number;
  name: string;
  email: string;
  // Thêm các thuộc tính khác nếu cần thiết
}

// Định nghĩa kiểu cho Context
interface UserContextType {
  id: string;
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUser: (updatedUser: User) => void;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/details");
        setUser(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    // Lắng nghe sự kiện đăng nhập hoặc thay đổi token
    const handleLogin = () => {
      fetchUserDetails();
    };
    window.addEventListener("user-logged-in", handleLogin);

    // Cũng kiểm tra và lấy lại dữ liệu khi token thay đổi
    const tokenCheckInterval = setInterval(() => {
      if (localStorage.getItem("token")) {
        fetchUserDetails();
        clearInterval(tokenCheckInterval);
      }
    }, 500);

    fetchUserDetails();

    return () => {
      window.removeEventListener("user-logged-in", handleLogin);
      clearInterval(tokenCheckInterval);
    };
  }, []);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, loading, error, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

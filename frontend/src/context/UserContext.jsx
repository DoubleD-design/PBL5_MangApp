import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/details"); 
        console.log("API Response:", response.data); // Kiểm tra dữ liệu trả về từ API  
        setUser(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    // Listen for login event or token change
    const handleLogin = () => {
      fetchUserDetails();
    };
    window.addEventListener("user-logged-in", handleLogin);

    // Also refetch when token changes
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

  const updateUser = (updatedUser) => {
    console.log("Previous User:", user); // Kiểm tra dữ liệu trước khi cập nhật
    console.log("Updated User Data:", updatedUser); // Kiểm tra dữ liệu mới
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...updatedUser }; // Merge dữ liệu
      console.log("New User State:", newUser); // Kiểm tra dữ liệu sau khi cập nhật
      return { ...newUser }; // Ensure a new object reference is returned
    });
  };

  return (
    <UserContext.Provider value={{ user, loading, error, updateUser }}>
      {console.log("Current User State in Context:", user)} {/* Kiểm tra giá trị */}
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

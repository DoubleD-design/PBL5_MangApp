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
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, loading, error, updateUser }}>
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

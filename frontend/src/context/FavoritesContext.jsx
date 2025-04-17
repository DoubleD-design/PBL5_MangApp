import { createContext, useState, useContext, useEffect } from 'react';
import favoriteService from '../services/favoriteService';
import authService from '../services/authService';

// Create context
const FavoritesContext = createContext();

// Create provider component
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load favorites from API when component mounts
  useEffect(() => {
    const fetchFavorites = async () => {
      // Only fetch favorites if user is authenticated
      if (authService.isAuthenticated()) {
        try {
          setLoading(true);
          const data = await favoriteService.getUserFavorites();
          setFavorites(data);
          setError(null);
        } catch (err) {
          console.error('Error fetching favorites:', err);
          setError('Failed to load favorites');
        } finally {
          setLoading(false);
        }
      } else {
        setFavorites([]);
        setLoading(false);
      }
    };

    // Listen for login event or token change
    const handleLogin = () => {
      fetchFavorites();
    };
    window.addEventListener("user-logged-in", handleLogin);
    // Also refetch when token changes
    const tokenCheckInterval = setInterval(() => {
      if (localStorage.getItem("token")) {
        fetchFavorites();
        clearInterval(tokenCheckInterval);
      }
    }, 500);

    fetchFavorites();
    return () => {
      window.removeEventListener("user-logged-in", handleLogin);
      clearInterval(tokenCheckInterval);
    };
  }, []);

  // Add manga to favorites
  const addFavorite = async (manga) => {
    // Only add to favorites if user is authenticated
    if (!authService.isAuthenticated()) {
      // Redirect to login or show message
      return false;
    }

    try {
      await favoriteService.addToFavorites(manga.id);
      // Update local state after successful API call
      setFavorites((prevFavorites) => {
        if (!prevFavorites.some((fav) => fav.id === manga.id)) {
          return [...prevFavorites, manga];
        }
        return prevFavorites;
      });
      return true;
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError('Failed to add to favorites');
      return false;
    }
  };

  // Remove manga from favorites
  const removeFavorite = async (mangaId) => {
    // Only remove from favorites if user is authenticated
    if (!authService.isAuthenticated()) {
      return false;
    }

    try {
      await favoriteService.removeFromFavorites(mangaId);
      // Update local state after successful API call
      setFavorites((prevFavorites) => 
        prevFavorites.filter((manga) => manga.id !== mangaId)
      );
      return true;
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Failed to remove from favorites');
      return false;
    }
  };

  // Check if a manga is in favorites
  const isFavorite = (mangaId) => {
    // If not authenticated, nothing is favorite
    if (!authService.isAuthenticated()) {
      return false;
    }
    
    return favorites.some((manga) => manga.id === mangaId);
  };

  // Context value
  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use the favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;
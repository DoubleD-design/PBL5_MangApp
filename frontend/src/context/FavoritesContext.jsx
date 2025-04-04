import { createContext, useState, useContext, useEffect } from 'react';

// Create context
const FavoritesContext = createContext();

// Create provider component
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage when component mounts
  useEffect(() => {
    const storedFavorites = localStorage.getItem('mangaFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mangaFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Add manga to favorites
  const addFavorite = (manga) => {
    setFavorites((prevFavorites) => {
      // Check if manga is already in favorites to avoid duplicates
      if (!prevFavorites.some((fav) => fav.id === manga.id)) {
        return [...prevFavorites, manga];
      }
      return prevFavorites;
    });
  };

  // Remove manga from favorites
  const removeFavorite = (mangaId) => {
    setFavorites((prevFavorites) => 
      prevFavorites.filter((manga) => manga.id !== mangaId)
    );
  };

  // Check if a manga is in favorites
  const isFavorite = (mangaId) => {
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
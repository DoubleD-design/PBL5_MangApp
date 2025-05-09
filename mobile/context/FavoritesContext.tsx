import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import favoriteService from '../services/favoriteService';
import authService from '../services/authService';

interface Manga {
  id: number;
  name: string;
}

interface FavoriteFromService {
  id: number;
  // Các thuộc tính khác từ favoriteService, nhưng không có name
}

interface FavoritesContextType {
  favorites: Manga[];
  addFavorite: (manga: Manga) => Promise<boolean>;
  removeFavorite: (mangaId: number) => Promise<boolean>;
  isFavorite: (mangaId: number) => boolean;
}

interface FavoritesProviderProps {
  children: ReactNode;
}

// Tạo context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Tạo provider component
export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<Manga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Tải danh sách yêu thích từ API khi component được mount
  useEffect(() => {
    const fetchFavorites = async () => {
      if (authService.isAuthenticated()) {
        try {
          setLoading(true);
          const data: FavoriteFromService[] = await favoriteService.getUserFavorites();

          // Chuyển đổi FavoriteFromService[] thành Manga[]
          const mangaFavorites = data.map((favorite) => ({
            id: favorite.id,
            name: 'Unknown Name', // Hoặc bạn có thể thay thế giá trị mặc định hoặc lấy từ nguồn khác
          }));
          setFavorites(mangaFavorites);
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

    fetchFavorites();
  }, []);

  // Thêm manga vào danh sách yêu thích
  const addFavorite = async (manga: Manga): Promise<boolean> => {
    if (!authService.isAuthenticated()) {
      return false;
    }

    try {
      await favoriteService.addToFavorites(manga.id);
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

  // Xóa manga khỏi danh sách yêu thích
  const removeFavorite = async (mangaId: number): Promise<boolean> => {
    if (!authService.isAuthenticated()) {
      return false;
    }

    try {
      await favoriteService.removeFromFavorites(mangaId);
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

  // Kiểm tra xem manga có trong danh sách yêu thích không
  const isFavorite = (mangaId: number): boolean => {
    if (!authService.isAuthenticated()) {
      return false;
    }
    return favorites.some((manga) => manga.id === mangaId);
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook để sử dụng context của favorites
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;

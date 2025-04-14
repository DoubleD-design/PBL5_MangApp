import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Box,
  Pagination,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import MangaCard from "../components/MangaCard";
import categoryService from "../services/categoryService";
import mangaService from "../services/mangaService";

// This will be replaced with API data
/*const mockMangas = [
  {
    id: 1,
    title: "One Piece",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Eiichiro Oda",
    rating: 4.8,
    views: "353691",
    genres: ["Adventure", "Action", "Fantasy"],
  },
  {
    id: 2,
    title: "Naruto",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Masashi Kishimoto",
    rating: 4.7,
    views: "339747",
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: 3,
    title: "Attack on Titan",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Hajime Isayama",
    rating: 4.9,
    views: "283968",
    genres: ["Action", "Drama", "Fantasy"],
  },
  {
    id: 4,
    title: "My Hero Academia",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Kohei Horikoshi",
    rating: 4.6,
    views: "226328",
    genres: ["Action", "Superhero", "School"],
  },
  {
    id: 5,
    title: "Demon Slayer",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Koyoharu Gotouge",
    rating: 4.8,
    views: "202821",
    genres: ["Action", "Supernatural", "Historical"],
  },
  {
    id: 6,
    title: "Jujutsu Kaisen",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Gege Akutami",
    rating: 4.7,
    views: "171212",
    genres: ["Action", "Supernatural", "School"],
  },
  {
    id: 7,
    title: "Dragon Ball",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Akira Toriyama",
    rating: 4.8,
    views: "168421",
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: 8,
    title: "Death Note",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tsugumi Ohba",
    rating: 4.9,
    views: "156324",
    genres: ["Mystery", "Psychological", "Supernatural"],
  },
];*/

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [mangas, setMangas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const mangasPerPage = 8;

  useEffect(() => {
    const fetchCategoryAndMangas = async () => {
      try {
        setLoading(true);
        
        // Fetch all categories
        const categoriesData = await categoryService.getAllCategories();
        console.log('Categories data:', categoriesData);
        
        // Find the category by slug
        const category = categoriesData.find((cat) => cat.slug === categorySlug);
        console.log('Found category:', category, 'for slug:', categorySlug);
        
        if (category) {
          setCategoryName(category.name);
          setCategoryId(category.id);
          
          // Fetch mangas by category
          console.log('Fetching mangas for category ID:', category.id);
          const mangasData = await mangaService.getMangasByCategory(
            category.id,
            currentPage - 1,
            mangasPerPage
          );
          
          console.log('Manga data response:', mangasData);
          
          // Check if mangasData has the expected structure
          if (mangasData && mangasData.content) {
            setMangas(mangasData.content);
            setTotalPages(mangasData.totalPages || 1);
            setError(null);
          } else {
            console.error('Unexpected manga data structure:', mangasData);
            setMangas(mangasData || []);
            setTotalPages(1);
            setError(null);
          }
        } else {
          setError('Category not found');
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to load category data: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryAndMangas();
  }, [categorySlug, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <MuiLink component={Link} to="#" color="inherit">
          Categories
        </MuiLink>
        <Typography color="text.primary">{categoryName}</Typography>
      </Breadcrumbs>

      {/* Category title */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {categoryName} Manga
      </Typography>

      {/* Manga grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : mangas.length > 0 ? (
        <Grid container spacing={3}>
          {mangas.map((manga) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={manga.id}>
              <MangaCard manga={manga} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "30vh",
          }}
        >
          <Typography variant="h5" color="text.secondary">
            No manga found in this category
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#fff",
              },
              "& .Mui-selected": {
                backgroundColor: "#ff6740 !important",
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default CategoryPage;
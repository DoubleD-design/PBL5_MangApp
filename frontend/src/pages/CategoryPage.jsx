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
} from "@mui/material";
import { Link } from "react-router-dom";
import MangaCard from "../components/MangaCard";
import categories from "../data/categories";

// Import mock data from Home.jsx
// In a real application, this would come from an API
const mockMangas = [
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
];

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [filteredMangas, setFilteredMangas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryName, setCategoryName] = useState("");
  const mangasPerPage = 8;

  useEffect(() => {
    // Find the category name from the slug
    const category = categories.find((cat) => cat.slug === categorySlug);
    if (category) {
      setCategoryName(category.name);
    }

    // Filter mangas by category
    const filtered = mockMangas.filter((manga) =>
      manga.genres.some(
        (genre) => genre.toLowerCase() === (category?.name || "").toLowerCase()
      )
    );
    setFilteredMangas(filtered);
    setCurrentPage(1); // Reset to first page when category changes
  }, [categorySlug]);

  // Calculate pagination
  const indexOfLastManga = currentPage * mangasPerPage;
  const indexOfFirstManga = indexOfLastManga - mangasPerPage;
  const currentMangas = filteredMangas.slice(indexOfFirstManga, indexOfLastManga);
  const totalPages = Math.ceil(filteredMangas.length / mangasPerPage);

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
      {filteredMangas.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {currentMangas.map((manga) => (
              <Grid item key={manga.id} xs={12} sm={6} md={4} lg={3}>
                <MangaCard manga={manga} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
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
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Typography variant="h5" color="text.secondary">
            No manga found in this category.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default CategoryPage;
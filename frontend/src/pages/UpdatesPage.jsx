import { useState, useEffect } from "react";
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
import mangaService from "../services/mangaService";

// This mock data will be replaced with API data
/*const mockMangas = [
  {
    id: 1,
    title: "One Piece",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Eiichiro Oda",
    rating: 4.8,
    views: "353691",
    genres: ["Adventure", "Action", "Fantasy"],
    updatedAt: "2023-05-15T10:30:00", // Added update date
    lastChapter: 1084,
  },
  {
    id: 2,
    title: "Naruto",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Masashi Kishimoto",
    rating: 4.7,
    views: "339747",
    genres: ["Action", "Adventure", "Fantasy"],
    updatedAt: "2023-05-14T15:45:00",
    lastChapter: 702,
  },
  {
    id: 3,
    title: "Attack on Titan",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Hajime Isayama",
    rating: 4.9,
    views: "283968",
    genres: ["Action", "Drama", "Fantasy"],
    updatedAt: "2023-05-16T08:20:00",
    lastChapter: 139,
  },
  {
    id: 4,
    title: "My Hero Academia",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Kohei Horikoshi",
    rating: 4.6,
    views: "226328",
    genres: ["Action", "Superhero", "School"],
    updatedAt: "2023-05-13T12:10:00",
    lastChapter: 362,
  },
  {
    id: 5,
    title: "Demon Slayer",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Koyoharu Gotouge",
    rating: 4.8,
    views: "202821",
    genres: ["Action", "Supernatural", "Historical"],
    updatedAt: "2023-05-17T09:15:00",
    lastChapter: 205,
  },
  {
    id: 6,
    title: "Jujutsu Kaisen",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Gege Akutami",
    rating: 4.7,
    views: "171212",
    genres: ["Action", "Supernatural", "School"],
    updatedAt: "2023-05-16T14:30:00",
    lastChapter: 220,
  },
  {
    id: 7,
    title: "Dragon Ball",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Akira Toriyama",
    rating: 4.8,
    views: "168421",
    genres: ["Action", "Adventure", "Fantasy"],
    updatedAt: "2023-05-12T11:45:00",
    lastChapter: 519,
  },
  {
    id: 8,
    title: "Death Note",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tsugumi Ohba",
    rating: 4.9,
    views: "156324",
    genres: ["Mystery", "Psychological", "Supernatural"],
    updatedAt: "2023-05-11T16:20:00",
    lastChapter: 108,
  },
  {
    id: 9,
    title: "Chainsaw Man",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tatsuki Fujimoto",
    rating: 4.8,
    views: "145000",
    genres: ["Action", "Horror", "Supernatural"],
    updatedAt: "2023-05-18T10:00:00",
    lastChapter: 131,
  },
  {
    id: 10,
    title: "Spy x Family",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tatsuya Endo",
    rating: 4.7,
    views: "132000",
    genres: ["Action", "Comedy", "Spy"],
    updatedAt: "2023-05-17T15:30:00",
    lastChapter: 77,
  },
  {
    id: 11,
    title: "Tokyo Revengers",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Ken Wakui",
    rating: 4.6,
    views: "128000",
    genres: ["Action", "Drama", "Time Travel"],
    updatedAt: "2023-05-15T13:45:00",
    lastChapter: 278,
  },
  {
    id: 12,
    title: "Black Clover",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Yūki Tabata",
    rating: 4.5,
    views: "120000",
    genres: ["Action", "Fantasy", "Magic"],
    updatedAt: "2023-05-14T09:20:00",
    lastChapter: 348,
  },
];
*/

const UpdatesPage = () => {
  const [mangas, setMangas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const mangasPerPage = 12;

  useEffect(() => {
    const fetchLatestUpdates = async () => {
      try {
        setLoading(true);
        // Fetch latest manga updates from API
        const latestData = await mangaService.getLatestUpdates(
          currentPage - 1,
          mangasPerPage
        );

        if (latestData && Array.isArray(latestData.content)) {
          setMangas(latestData.content);
          setTotalPages(latestData.totalPages || 1);
          setError(null);
        } else {
          console.warn("Invalid data format received:", latestData);
          setMangas([]);
          setTotalPages(1);
          setError("Failed to load manga updates. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching latest updates:", err);
        setError("Failed to load manga updates. Please try again later.");
        setMangas([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestUpdates();
  }, [currentPage]);

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
        <Typography color="text.primary">Latest Updates</Typography>
      </Breadcrumbs>

      {/* Page title */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Latest Manga Updates
      </Typography>

      {/* Loading state */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : mangas.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {mangas.map((manga) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={manga.id}>
                <MangaCard manga={manga} />
                {/* <Box sx={{ mt: 1, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Chapter {manga.lastChapter || "N/A"} • Updated {new Date(manga.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box> */}
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
              mb: 2,
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", my: 5 }}>
          No manga updates found.
        </Typography>
      )}
    </Container>
  );
};

export default UpdatesPage;

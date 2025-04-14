import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import MangaCard from '../components/MangaCard';
import mangaService from '../services/mangaService';

const Ranking = () => {
  const [page, setPage] = useState(1);
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const mangasPerPage = 12;

  useEffect(() => {
    const fetchRankedMangas = async () => {
      try {
        setLoading(true);
        // Fetch ranked manga from API
        const response = await mangaService.getRankedMangas(page - 1, mangasPerPage);
        
        if (response && Array.isArray(response.content)) {
          setMangas(response.content);
          setTotalPages(response.totalPages || 1);
          setError(null);
        } else {
          console.warn("Invalid data format received:", response);
          setMangas([]);
          setTotalPages(1);
          setError("Failed to load ranked manga. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching ranked manga:", err);
        setError("Failed to load ranked manga. Please try again later.");
        setMangas([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchRankedMangas();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to get medal color based on rank
  const getMedalColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return 'primary.main'; // Default color for other ranks
    }
  };

  // Function to get grid size based on rank
  const getGridSize = (rank) => {
    if (rank <= 3) {
      return { xs: 12, sm: 6, md: 6, lg: 4 }; // Larger size for top 3
    }
    return { xs: 12, sm: 6, md: 4, lg: 3 }; // Regular size for others
  };

  return (
    <Box sx={{ py: 4, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', mb: 4 }}>
          Top 40 Most Viewed Manga
        </Typography>

        <Grid container spacing={3}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ width: '100%', py: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : mangas.map((manga, index) => {
            const rank = ((page - 1) * mangasPerPage) + index + 1;
            const gridSize = getGridSize(rank);
            const medalColor = getMedalColor(rank);
            
            return (
              <Grid item {...gridSize} key={manga.id}>
                <Box 
                  sx={{ 
                    position: 'relative',
                    transform: rank <= 3 ? 'scale(1.05)' : 'none',
                    transition: 'transform 0.3s ease',
                    zIndex: rank <= 3 ? 10 : 1,
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      zIndex: 2,
                      backgroundColor: medalColor,
                      color: rank <= 2 ? 'black' : 'white', // Black text for gold/silver, white for others
                      width: rank <= 3 ? 40 : 30,
                      height: rank <= 3 ? 40 : 30,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: rank <= 3 ? '1.2rem' : '1rem',
                      boxShadow: rank <= 3 ? '0 0 10px rgba(0,0,0,0.5)' : 'none',
                      border: rank <= 3 ? '2px solid white' : 'none',
                    }}
                  >
                    {rank}
                  </Box>
                  <MangaCard manga={manga} />
                </Box>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Ranking;
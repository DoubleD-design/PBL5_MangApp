import { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Pagination,
} from '@mui/material';
import MangaCard from '../components/MangaCard';

// Mock data for ranked manga list
const mockRankedMangas = [
  {
    id: 1,
    title: 'One Piece',
    cover: 'https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg',
    author: 'Eiichiro Oda',
    rating: 4.8,
    views: 353691,
    genres: ['Adventure', 'Action', 'Fantasy'],
  },
  {
    id: 2,
    title: 'Naruto',
    cover: 'https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg',
    author: 'Masashi Kishimoto',
    rating: 4.7,
    views: 339747,
    genres: ['Action', 'Adventure', 'Fantasy'],
  },
  {
    id: 3,
    title: 'Attack on Titan',
    cover: 'https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg',
    author: 'Hajime Isayama',
    rating: 4.9,
    views: 283968,
    genres: ['Action', 'Drama', 'Fantasy'],
  },
  {
    id: 4,
    title: 'My Hero Academia',
    cover: 'https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg',
    author: 'Kohei Horikoshi',
    rating: 4.6,
    views: 226328,
    genres: ['Action', 'Superhero', 'School'],
  },
  {
    id: 5,
    title: 'Demon Slayer',
    cover: 'https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg',
    author: 'Koyoharu Gotouge',
    rating: 4.8,
    views: 202821,
    genres: ['Action', 'Supernatural', 'Historical'],
  },
  {
    id: 6,
    title: 'Jujutsu Kaisen',
    cover: 'https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg',
    author: 'Gege Akutami',
    rating: 4.7,
    views: 171212,
    genres: ['Action', 'Supernatural', 'School'],
  },
  {
    id: 7,
    title: 'Dragon Ball',
    cover: 'https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg',
    author: 'Akira Toriyama',
    rating: 4.8,
    views: 168421,
    genres: ['Action', 'Adventure', 'Fantasy'],
  },
  {
    id: 8,
    title: 'Death Note',
    cover: 'https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg',
    author: 'Tsugumi Ohba',
    rating: 4.9,
    views: 156324,
    genres: ['Mystery', 'Psychological', 'Supernatural'],
  },
  {
    id: 9,
    title: 'Black Clover',
    cover: 'https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg',
    author: 'Yūki Tabata',
    rating: 4.5,
    views: 145632,
    genres: ['Action', 'Fantasy', 'Magic'],
  },
  {
    id: 10,
    title: 'Tokyo Ghoul',
    cover: 'https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg',
    author: 'Sui Ishida',
    rating: 4.7,
    views: 142789,
    genres: ['Horror', 'Supernatural', 'Psychological'],
  },
  // Additional manga entries to complete top 40
  // ... (entries 11-40 with decreasing view counts)
].sort((a, b) => b.views - a.views); // Sort by views in descending order

const Ranking = () => {
  const [page, setPage] = useState(1);
  const mangasPerPage = 12;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * mangasPerPage;
  const displayedMangas = mockRankedMangas.slice(startIndex, startIndex + mangasPerPage);

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
          {displayedMangas.map((manga, index) => {
            const rank = startIndex + index + 1;
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
            count={Math.ceil(mockRankedMangas.length / mangasPerPage)}
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
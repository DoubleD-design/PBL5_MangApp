import { useState } from 'react';
import { Container, Grid, Typography, Box, Pagination } from '@mui/material';
import MangaCard from '../components/MangaCard';

// Mock data for manga list
const mockMangas = [
  {
    id: 1,
    title: 'One Piece',
    cover: 'https://m.media-amazon.com/images/I/51FXs5gTmdL._SY445_SX342_.jpg',
    author: 'Eiichiro Oda',
    rating: 4.8,
    genres: ['Adventure', 'Action', 'Fantasy']
  },
  {
    id: 2,
    title: 'Naruto',
    cover: 'https://m.media-amazon.com/images/I/51uYlDqRHhL._SY445_SX342_.jpg',
    author: 'Masashi Kishimoto',
    rating: 4.7,
    genres: ['Action', 'Adventure', 'Fantasy']
  },
  {
    id: 3,
    title: 'Attack on Titan',
    cover: 'https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg',
    author: 'Hajime Isayama',
    rating: 4.9,
    genres: ['Action', 'Drama', 'Fantasy']
  },
  {
    id: 4,
    title: 'My Hero Academia',
    cover: 'https://m.media-amazon.com/images/I/51uE3jDzsFL._SY445_SX342_.jpg',
    author: 'Kohei Horikoshi',
    rating: 4.6,
    genres: ['Action', 'Superhero', 'School']
  },
  {
    id: 5,
    title: 'Demon Slayer',
    cover: 'https://m.media-amazon.com/images/I/51rRBpYSPSL._SY445_SX342_.jpg',
    author: 'Koyoharu Gotouge',
    rating: 4.8,
    genres: ['Action', 'Supernatural', 'Historical']
  },
  {
    id: 6,
    title: 'Jujutsu Kaisen',
    cover: 'https://m.media-amazon.com/images/I/51QUzC1IeYL._SY445_SX342_.jpg',
    author: 'Gege Akutami',
    rating: 4.7,
    genres: ['Action', 'Supernatural', 'School']
  },
  {
    id: 7,
    title: 'Dragon Ball',
    cover: 'https://m.media-amazon.com/images/I/51xQWQ7lWwL._SY445_SX342_.jpg',
    author: 'Akira Toriyama',
    rating: 4.8,
    genres: ['Action', 'Adventure', 'Fantasy']
  },
  {
    id: 8,
    title: 'Death Note',
    cover: 'https://m.media-amazon.com/images/I/51SkIDTd9rL._SY445_SX342_.jpg',
    author: 'Tsugumi Ohba',
    rating: 4.9,
    genres: ['Mystery', 'Psychological', 'Supernatural']
  }
];

const Home = () => {
  const [page, setPage] = useState(1);
  const mangasPerPage = 8;
  const totalPages = Math.ceil(mockMangas.length / mangasPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get current mangas
  const indexOfLastManga = page * mangasPerPage;
  const indexOfFirstManga = indexOfLastManga - mangasPerPage;
  const currentMangas = mockMangas.slice(indexOfFirstManga, indexOfLastManga);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Popular Manga
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover the most popular manga series loved by readers worldwide
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {currentMangas.map((manga) => (
          <Grid item key={manga.id} xs={12} sm={6} md={4} lg={3}>
            <MangaCard manga={manga} />
          </Grid>
        ))}
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
  );
};

export default Home;
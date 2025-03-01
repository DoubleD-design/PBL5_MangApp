import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  Rating,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import { Bookmark, BookmarkBorder, ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Mock data for a single manga
const mockMangaDetails = {
  1: {
    id: 1,
    title: 'One Piece',
    cover: 'https://m.media-amazon.com/images/I/51FXs5gTmdL._SY445_SX342_.jpg',
    author: 'Eiichiro Oda',
    rating: 4.8,
    genres: ['Adventure', 'Action', 'Fantasy'],
    status: 'Ongoing',
    releaseYear: 1999,
    description: 'Gol D. Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.',
    chapters: [
      { number: 1, title: 'Romance Dawn', date: '1999-07-22' },
      { number: 2, title: 'They Call Him "Straw Hat Luffy"', date: '1999-07-29' },
      { number: 3, title: 'Morgan versus Luffy', date: '1999-08-05' },
      { number: 4, title: 'Marine Captain Axe-Hand Morgan', date: '1999-08-12' },
      { number: 5, title: 'Pirate King and Great Swordsman', date: '1999-08-19' },
      { number: 6, title: 'The First Person', date: '1999-08-26' },
      { number: 7, title: 'Friends', date: '1999-09-02' },
      { number: 8, title: 'Introducing Nami', date: '1999-09-09' },
      { number: 9, title: 'The Devil Girl', date: '1999-09-16' },
      { number: 10, title: 'The Incident at the Bar', date: '1999-09-23' },
    ]
  },
  // Add more manga details as needed
};

const MangaDetail = () => {
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // In a real app, you would fetch the manga details based on the ID
  const manga = mockMangaDetails[id] || mockMangaDetails[1]; // Fallback to first manga if ID not found

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button 
        component={Link} 
        to="/" 
        startIcon={<ArrowBack />} 
        sx={{ mb: 2 }}
      >
        Back to Browse
      </Button>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Manga Cover */}
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={manga.cover}
              alt={manga.title}
              sx={{
                width: '100%',
                maxHeight: 500,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
            <Button
              variant="contained"
              fullWidth
              color="primary"
              sx={{ mt: 2 }}
              startIcon={isFavorite ? <Bookmark /> : <BookmarkBorder />}
              onClick={toggleFavorite}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </Grid>
          
          {/* Manga Details */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {manga.title}
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              by {manga.author} • {manga.releaseYear} • {manga.status}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={manga.rating} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {manga.rating} / 5
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {manga.genres.map((genre, index) => (
                <Chip key={index} label={genre} color="primary" variant="outlined" />
              ))}
            </Box>
            
            <Typography variant="body1" paragraph>
              {manga.description}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs for Chapters and Reviews */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="manga content tabs">
            <Tab label="Chapters" id="manga-tab-0" />
            <Tab label="Reviews" id="manga-tab-1" />
            <Tab label="Related" id="manga-tab-2" />
          </Tabs>
        </Box>
        
        {/* Chapters Tab */}
        <div role="tabpanel" hidden={tabValue !== 0}>
          {tabValue === 0 && (
            <List>
              {manga.chapters.map((chapter, index) => (
                <div key={chapter.number}>
                  <ListItem button component={Link} to={`/manga/${manga.id}/chapter/${chapter.number}`}>
                    <ListItemText 
                      primary={`Chapter ${chapter.number}: ${chapter.title}`} 
                      secondary={`Released: ${chapter.date}`} 
                    />
                  </ListItem>
                  {index < manga.chapters.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          )}
        </div>
        
        {/* Reviews Tab */}
        <div role="tabpanel" hidden={tabValue !== 1}>
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="body1">
                Reviews will be displayed here.
              </Typography>
            </Box>
          )}
        </div>
        
        {/* Related Tab */}
        <div role="tabpanel" hidden={tabValue !== 2}>
          {tabValue === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="body1">
                Related manga will be displayed here.
              </Typography>
            </Box>
          )}
        </div>
      </Box>
    </Container>
  );
};

export default MangaDetail;
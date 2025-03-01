import { Card, CardContent, CardMedia, Typography, Box, Rating, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

const MangaCard = ({ manga }) => {
  return (
    <Card 
      component={Link} 
      to={`/manga/${manga.id}`} 
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        backgroundColor: 'background.paper',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          cursor: 'pointer'
        }
      }}>
    
      <CardMedia
        component="img"
        image={manga.cover}
        alt={manga.title}
        sx={{
          height: 320,
          objectFit: 'cover',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {manga.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {manga.author}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={manga.rating} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {manga.rating}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {manga.genres.map((genre, index) => (
            <Chip
              key={index}
              label={genre}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MangaCard;
import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Container } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Mock featured manga data
const featuredMangas = [
  {
    id: 1,
    title: 'Night Light Hounds',
    subtitle: 'Wolves x Gangs x Vampires.',
    description: 'Survival of the fittest in the dark begins now.',
    image: 'https://mangaplus.shueisha.co.jp/_next/image?url=https%3A%2F%2Fcdn.mangaplus.shueisha.co.jp%2Fuser_data%2Fweb%2Fimages%2Ffeature%2Fnight-light-hounds_20240401_en.jpg&w=3840&q=75'
  },
  {
    id: 2,
    title: 'BLAZE',
    subtitle: 'One-Shot!',
    description: 'It all began on one summer day...',
    image: 'https://mangaplus.shueisha.co.jp/_next/image?url=https%3A%2F%2Fcdn.mangaplus.shueisha.co.jp%2Fuser_data%2Fweb%2Fimages%2Ffeature%2Fblaze_20240401_en.jpg&w=3840&q=75'
  },
  {
    id: 3,
    title: 'Astro Baby',
    subtitle: 'New Series!',
    description: 'A cosmic adventure begins.',
    image: 'https://mangaplus.shueisha.co.jp/_next/image?url=https%3A%2F%2Fcdn.mangaplus.shueisha.co.jp%2Fuser_data%2Fweb%2Fimages%2Ffeature%2Fastro-baby_20240401_en.jpg&w=3840&q=75'
  },
  {
    id: 4,
    title: 'Oversleeping Takahashi',
    subtitle: 'New Chapter!',
    description: 'The daily life of a sleepyhead.',
    image: 'https://mangaplus.shueisha.co.jp/_next/image?url=https%3A%2F%2Fcdn.mangaplus.shueisha.co.jp%2Fuser_data%2Fweb%2Fimages%2Ffeature%2Foversleeping-takahashi_20240401_en.jpg&w=3840&q=75'
  },
  {
    id: 5,
    title: '2.5 Dimensional Seduction',
    subtitle: 'New Chapter!',
    description: 'When cosplay meets romance.',
    image: 'https://mangaplus.shueisha.co.jp/_next/image?url=https%3A%2F%2Fcdn.mangaplus.shueisha.co.jp%2Fuser_data%2Fweb%2Fimages%2Ffeature%2F2-5-dimensional-seduction_20240401_en.jpg&w=3840&q=75'
  },
];

const FeaturedCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMangas.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMangas.length) % featuredMangas.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ 
      width: '100%', 
      height: '400px', 
      position: 'relative',
      backgroundColor: '#000',
      overflow: 'hidden'
    }}>
      <Container maxWidth="xl">
        {featuredMangas.map((manga, index) => (
          <Box
            key={manga.id}
            component={Link}
            to={`/manga/${manga.id}`}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <Box
              sx={{
                width: '50%',
                p: 4,
                zIndex: 1
              }}
            >
              <Typography variant="h3" gutterBottom sx={{ color: '#fff' }}>
                {manga.title}
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ color: '#ff6740' }}>
                {manga.subtitle}
              </Typography>
              <Typography variant="body1" sx={{ color: '#fff' }}>
                {manga.description}
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                width: '60%',
                height: '100%',
                backgroundImage: `url(${manga.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to right, #000 0%, transparent 100%)'
                }
              }}
            />
          </Box>
        ))}
      </Container>

      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.5)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
        }}
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.5)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
        }}
      >
        <ChevronRight />
      </IconButton>

      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1
        }}
      >
        {featuredMangas.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: currentSlide === index ? '#ff6740' : '#fff',
              cursor: 'pointer'
            }}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedCarousel;
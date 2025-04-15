import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Container, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import mangaService from '../services/mangaService';

const FeaturedCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredMangas, setFeaturedMangas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopMangas = async () => {
      try {
        const data = await mangaService.getMostViewedMangas(5);
        const formattedData = data.map((manga) => ({
          id: manga.id,
          title: manga.title,
          subtitle: `${manga.views.toLocaleString()} views`,
          description: manga.description || `By ${manga.author}`,
          image: manga.coverImage,
        }));
        setFeaturedMangas(formattedData);
      } catch (error) {
        console.error("Error fetching top mangas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMangas();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMangas.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredMangas.length) % featuredMangas.length
    );
  };

  useEffect(() => {
    const preloadImages = () => {
      featuredMangas.forEach(manga => {
        const img = new Image();
        img.src = manga.image;
      });
    };

    if (featuredMangas.length > 0) {
      preloadImages();
    }
  }, [featuredMangas]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [featuredMangas.length]);

  if (loading) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: '400px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000'
      }}>
        <CircularProgress />
      </Box>
    );
  }

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
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: currentSlide === index ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              visibility: currentSlide === index ? "visible" : "hidden",
            }}
          >
            <Box
              sx={{
                width: "50%",
                p: 4,
                zIndex: 1,
              }}
            >
              <Typography variant="h3" gutterBottom sx={{ color: "#fff" }}>
                {manga.title}
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ color: "#ff6740" }}>
                {manga.subtitle}
              </Typography>
              <Typography variant="body1" sx={{ color: "#fff" }}>
                {manga.description}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                right: 0,
                width: "60%",
                height: "100%",
                backgroundImage: `url(${manga.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(to right, #000 0%, transparent 100%)",
                },
              }}
            />
          </Box>
        ))}
      </Container>

      <IconButton
        onClick={prevSlide}
        sx={{
          position: "absolute",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#fff",
          backgroundColor: "rgba(0,0,0,0.5)",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
        }}
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#fff",
          backgroundColor: "rgba(0,0,0,0.5)",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
        }}
      >
        <ChevronRight />
      </IconButton>

      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
        }}
      >
        {featuredMangas.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: currentSlide === index ? "#ff6740" : "#fff",
              cursor: "pointer",
            }}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedCarousel;
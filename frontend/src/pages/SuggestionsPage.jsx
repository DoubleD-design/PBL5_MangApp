import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
  Rating,
  Button,
  Fade,
  Paper,
  Divider,
} from "@mui/material";
import {
  Refresh,
  Star,
  Visibility,
  Bookmark,
  BookmarkBorder,
  AutoAwesome,
  TrendingUp,
  Recommend,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import suggestionService from "../services/suggestionService";
import authService from "../services/authService";
import { useFavorites } from "../context/FavoritesContext";

const SuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const fetchSuggestions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      if (!authService.isAuthenticated()) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const user = authService.getCurrentUser();
      if (user && user.id) {
        const suggestedMangas = await suggestionService.getSuggestedMangas(user.id);
        setSuggestions(suggestedMangas);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError("Failed to load manga suggestions. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchSuggestions(true);
  };

  const handleFavoriteToggle = async (manga) => {
    const isFavorite = favorites.some(fav => fav.id === manga.id);
    
    // If not authenticated, show alert
    if (!authService.isAuthenticated()) {
      alert('Please log in to add favorites');
      return;
    }
    
    try {
      if (isFavorite) {
        const success = await removeFavorite(manga.id);
        if (success) {
          console.log('Removed from favorites');
        } else {
          console.error('Failed to remove from favorites');
        }
      } else {
        const success = await addFavorite(manga);
        if (success) {
          console.log('Added to favorites');
        } else {
          console.error('Failed to add to favorites');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', background: 'black' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #EB1C1C 0%, #FCB045 100%)',
          color: 'white',
          py: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs 
            aria-label="breadcrumb" 
            sx={{ 
              mb: 3,
              '& .MuiBreadcrumbs-separator': { color: 'rgb(255, 255, 255)' },
              '& a': { color: 'rgb(255, 255, 255)', textDecoration: 'none' },
              '& a:hover': { color: 'white' },
            }}
          >
            <MuiLink component={Link} to="/">
              Home
            </MuiLink>
            <Typography sx={{ color: 'white', fontWeight: 500 }}>Suggestions</Typography>
          </Breadcrumbs>

          {/* Header Content */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AutoAwesome sx={{ fontSize: 40, color: '#FFD700' }} />
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700,
                    background: '#ffff',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    // textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Manga Suggestions for You
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Recommend />} 
                  label="AI Powered" 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 500,
                  }} 
                />
                <Chip 
                  icon={<TrendingUp />} 
                  label="Personalized" 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 500,
                  }} 
                />
              </Box>
            </Box>
            
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="contained"
              startIcon={refreshing ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                },
              }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ color: '#667eea', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading your personalized suggestions...
            </Typography>
          </Box>
        ) : error ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: '#fff3f3' }}>
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            <Button onClick={handleRefresh} variant="contained" color="primary">
              Try Again
            </Button>
          </Paper>
        ) : !authService.isAuthenticated() ? (
          <Paper 
            elevation={6}
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: 4,
            }}
          >
            <AutoAwesome sx={{ fontSize: 80, color: '#667eea', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
              Welcome to Manga Suggestions!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              Please log in to get personalized manga recommendations based on your reading history and preferences.
            </Typography>
            <Button 
              component={Link} 
              to="/login" 
              variant="contained" 
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #FFD700, #FF6B35)',
                px: 4,
                py: 1.5,
                borderRadius: 3,
              }}
            >
              Login to Get Started
            </Button>
          </Paper>
        ) : suggestions.length > 0 ? (
          <>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                mb: 4, 
                background: 'rgb(36, 40, 47)',
                borderRadius: 3,
                border: '1px solid rgba(102, 126, 234, 0.1)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <TrendingUp sx={{ color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffff' }}>
                  Recommended for You
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                Based on your reading history, here are some manga you might enjoy. Our AI analyzes your preferences to bring you the best recommendations!
              </Typography>
            </Paper>
            
            <Grid 
              container 
              spacing={{ xs: 3, sm: 4, md: 5 }} 
              sx={{ 
                px: { xs: 1, sm: 2 },
                pb: 4,
              }}
            >
              {suggestions.map((manga, index) => {
                const isFavorite = favorites.some(fav => fav.id === manga.id);
                return (
                  <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    lg={3} 
                    xl={2.4}
                    key={manga.id}
                  >
                    <Fade in={true} timeout={300 + index * 100}>
                      <Card
                        component={Link}
                        to={`/manga/${manga.id}`}
                        sx={{
                          position: "relative",
                          height: 450,
                          textDecoration: "none",
                          borderRadius: 4,
                          overflow: "hidden",
                          cursor: "pointer",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          transform: "translateY(0) scale(1)",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                          "&:hover": {
                            transform: "translateY(-12px) scale(1.02)",
                            boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
                            "& .manga-image": {
                              transform: "scale(1.1)",
                            },
                            "& .manga-overlay": {
                              background: "linear-gradient(135deg, #EB1C1C 0%, #FCB045 100%)",
                            },
                          },
                        }}
                      >
                        {/* Image */}
                        <Box sx={{ position: "relative", height: "70%", overflow: "hidden" }}>
                          <CardMedia
                            component="img"
                            image={manga.coverImage}
                            alt={manga.title}
                            className="manga-image"
                            sx={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          />
                          
                          {/* Gradient Overlay */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.8) 100%)",
                            }}
                          />
                          
                          {/* Rating Badge */}
                          {manga.rating && (
                            <Chip
                              icon={<Star sx={{ color: "#FFD700 !important", fontSize: 16 }} />}
                              label={manga.rating.toFixed(1)}
                              sx={{
                                position: "absolute",
                                top: 12,
                                left: 12,
                                backgroundColor: "rgba(0,0,0,0.8)",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "0.8rem",
                                height: 32,
                                backdropFilter: "blur(10px)",
                              }}
                            />
                          )}
                          
                          {/* Favorite Button */}
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleFavoriteToggle(manga);
                            }}
                            sx={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              backgroundColor: "rgba(0,0,0,0.7)",
                              backdropFilter: "blur(10px)",
                              color: isFavorite ? "#ff6740" : "white",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.9)",
                                color: isFavorite ? "#ff6740" : "#333",
                                transform: "scale(1.1)",
                              },
                              width: 44,
                              height: 44,
                            }}
                          >
                            {isFavorite ? <Bookmark /> : <BookmarkBorder />}
                          </IconButton>
                          
                          {/* View Count */}
                          {manga.viewCount && (
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 12,
                                right: 12,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                backgroundColor: "rgba(0,0,0,0.7)",
                                backdropFilter: "blur(10px)",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                              }}
                            >
                              <Visibility sx={{ fontSize: 14, color: "white" }} />
                              <Typography variant="caption" sx={{ color: "white", fontWeight: 500 }}>
                                {manga.viewCount > 1000 ? `${(manga.viewCount / 1000).toFixed(1)}k` : manga.viewCount}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        
                        {/* Content */}
                        <CardContent
                          className="manga-overlay"
                          sx={{
                            height: "30%",
                            background: "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%)",
                            color: "white",
                            p: 2.5,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            transition: "all 0.4s ease",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                lineHeight: 1.3,
                                mb: 0.5,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                              }}
                            >
                              {manga.title}
                            </Typography>
                            
                            <Typography
                              variant="body2"
                              sx={{
                                color: "rgba(255,255,255,0.8)",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                              }}
                            >
                              {manga.author}
                            </Typography>
                          </Box>
                          
                          {/* Categories */}
                          {manga.categories && manga.categories.length > 0 && (
                            <Box sx={{ display: "flex", gap: 0.5, mt: 1, flexWrap: "wrap" }}>
                              {manga.categories.slice(0, 2).map((category, idx) => (
                                <Chip
                                  key={idx}
                                  label={category.name || category}
                                  size="small"
                                  sx={{
                                    backgroundColor: " #FFD700",
                                    color: "black",
                                    fontSize: "0.7rem",
                                    height: 22,
                                    fontWeight: 500,
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                );
              })}
            </Grid>
          </>
        ) : (
          <Paper 
            elevation={6}
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)',
              borderRadius: 4,
            }}
          >
            <AutoAwesome sx={{ fontSize: 80, color: '#667eea', mb: 2, opacity: 0.7 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
              No Suggestions Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              Start reading some manga to get personalized recommendations! Our AI will analyze your preferences and suggest amazing manga just for you.
            </Typography>
            <Button 
              component={Link} 
              to="/" 
              variant="contained" 
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #FFD700, #FF6B35)',
                px: 4,
                py: 1.5,
                borderRadius: 3,
              }}
            >
              Explore Manga
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default SuggestionsPage;
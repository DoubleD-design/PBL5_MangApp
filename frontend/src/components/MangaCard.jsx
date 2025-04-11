import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Chip,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { Link } from "react-router-dom";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { useFavorites } from "../context/FavoritesContext";
import { useState, useEffect } from "react";
import authService from "../services/authService";

const MangaCard = ({ manga }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [favoriteStatus, setFavoriteStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Check favorite status when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (authService.isAuthenticated()) {
        const status = isFavorite(manga.id);
        setFavoriteStatus(status);
      }
    };
    
    checkFavoriteStatus();
  }, [manga.id, isFavorite]);
  
  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Prevent navigation to manga detail
    e.stopPropagation();
    
    // If not authenticated, show login message
    if (!authService.isAuthenticated()) {
      setSnackbarMessage('Please log in to add favorites');
      setSnackbarSeverity('info');
      setOpenSnackbar(true);
      return;
    }
    
    setLoading(true);
    
    try {
      if (favoriteStatus) {
        const success = await removeFavorite(manga.id);
        if (success) {
          setFavoriteStatus(false);
          setSnackbarMessage('Removed from favorites');
          setSnackbarSeverity('success');
        } else {
          setSnackbarMessage('Failed to remove from favorites');
          setSnackbarSeverity('error');
        }
      } else {
        const success = await addFavorite(manga);
        if (success) {
          setFavoriteStatus(true);
          setSnackbarMessage('Added to favorites');
          setSnackbarSeverity('success');
        } else {
          setSnackbarMessage('Failed to add to favorites');
          setSnackbarSeverity('error');
        }
      }
    } catch (error) {
      setSnackbarMessage('An error occurred');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  
  return (
    <>
    <Card
      component={Link}
      to={`/manga/${manga.id}`}
      sx={{
        position: "relative",
        height: "100%",
        textDecoration: "none",
        backgroundColor: "background.paper",
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow 0.4s ease-in-out",
        "&:hover": {
          boxShadow: "0 16px 30px rgba(255, 103, 64, 0.8)",
          "&:hover .manga-info": {
            backgroundColor: "rgba(0,0,0,0.9)", // Đậm hơn
            transition: "background-color 0.3s ease-out",
          },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          transition: "opacity 0.3s ease-in-out",
          opacity: 0,
          boxShadow: "0 16px 30px rgba(255, 103, 64, 0.8)",
          borderRadius: 2,
        },
        "&:hover::before": {
          opacity: 1,
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={manga.coverImage}
          alt={manga.title}
          sx={{
            height: 280,
            width: "100%",
            objectFit: "cover",
            zIndex: 1,
            position: "relative",
            borderRadius: "8px",
          }}
        />
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: favoriteStatus ? "#ff6740" : "white",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.7)",
            },
            zIndex: 2,
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : favoriteStatus ? (
            <Bookmark />
          ) : (
            <BookmarkBorder />
          )}
        </IconButton>
      </Box>
      <Box
        className="manga-info"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          p: 2,
          paddingTop: 2.5,
          paddingBottom: 2.5,
          transition: "background-color 0.3s ease-out, transform 0.3s ease-out",
          transform: "translateY(0)",
          zIndex: 2,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "0.9rem",
            lineHeight: 1.2,
            mb: 0.5,
          }}
          noWrap
        >
          {manga.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.8rem",
            lineHeight: 1.2,
          }}
        >
          {manga.author}
        </Typography>
      </Box>
    </Card>
    <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
      <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
    </>
  );
};

export default MangaCard;

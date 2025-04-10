import { Container, Typography, Grid, Box, Breadcrumbs, Link as MuiLink, CircularProgress, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import MangaCard from "../components/MangaCard";
import { useFavorites } from "../context/FavoritesContext";
import { useEffect } from "react";
import authService from "../services/authService";

const FavoritesPage = () => {
  const { favorites, loading, error } = useFavorites();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <Typography color="text.primary">Favorites</Typography>
      </Breadcrumbs>

      {/* Page title */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        My Favorite Manga
      </Typography>

      {/* Manga grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : !authService.isAuthenticated() ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Typography variant="h5" color="text.secondary">
            Please log in to view your favorites.
          </Typography>
        </Box>
      ) : favorites.length > 0 ? (
        <Grid container spacing={3}>
          {favorites.map((manga) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={manga.id}>
              <MangaCard manga={manga} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Typography variant="h5" color="text.secondary">
            You haven't added any manga to your favorites yet.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default FavoritesPage;
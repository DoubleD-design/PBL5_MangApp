import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import MangaCard from "../components/MangaCard";
import suggestionService from "../services/suggestionService";
import authService from "../services/authService";

const SuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!authService.isAuthenticated()) {
          setLoading(false);
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
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <Typography color="text.primary">Suggestions</Typography>
      </Breadcrumbs>

      {/* Page title */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Manga Suggestions for You
      </Typography>

      {/* Content */}
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
            Please log in to get personalized manga suggestions.
          </Typography>
        </Box>
      ) : suggestions.length > 0 ? (
        <>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Based on your reading history, here are some manga you might enjoy:
          </Typography>
          <Grid container spacing={3}>
            {suggestions.map((manga) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={manga.id}>
                <MangaCard manga={manga} />
              </Grid>
            ))}
          </Grid>
        </>
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
            No suggestions available. Start reading some manga to get personalized recommendations!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SuggestionsPage;
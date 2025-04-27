import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { History, DeleteSweep } from "@mui/icons-material";
import readingHistoryService from "../services/readingHistoryService";
import mangaService from "../services/mangaService";
import { format } from "date-fns";

const ReadingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mangaDetails, setMangaDetails] = useState({});

  useEffect(() => {
    const fetchReadingHistory = async () => {
      try {
        setLoading(true);
        const historyData = await readingHistoryService.getReadingHistory();

        // Sort by timestamp (newest first)
        const sortedHistory = [...historyData].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setHistory(sortedHistory);

        // Fetch manga details for each unique manga ID
        const uniqueMangaIds = [
          ...new Set(sortedHistory.map((item) => item.mangaId)),
        ];
        const mangaDetailsMap = {};

        for (const mangaId of uniqueMangaIds) {
          try {
            const manga = await mangaService.getMangaById(mangaId);
            mangaDetailsMap[mangaId] = manga;
          } catch (err) {
            console.error(`Error fetching manga ${mangaId}:`, err);
          }
        }

        setMangaDetails(mangaDetailsMap);
        setError(null);
      } catch (err) {
        console.error("Error fetching reading history:", err);
        setError("Failed to load reading history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReadingHistory();
  }, []);

  const handleClearHistory = async () => {
    if (
      window.confirm("Are you sure you want to clear your reading history?")
    ) {
      try {
        await readingHistoryService.clearReadingHistory();
        setHistory([]);
      } catch (err) {
        console.error("Error clearing reading history:", err);
        setError("Failed to clear reading history.");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  // Group history items by manga
  const historyByManga = history.reduce((acc, item) => {
    if (!acc[item.mangaId]) {
      acc[item.mangaId] = [];
    }
    acc[item.mangaId].push(item);
    return acc;
  }, {});

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <Typography color="text.primary">Reading History</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <History sx={{ mr: 1 }} />
          Reading History
        </Typography>
        {history.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweep />}
            onClick={handleClearHistory}
          >
            Clear History
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : history.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            backgroundColor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No reading history found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start reading manga to build your history!
          </Typography>
          <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
            Browse Manga
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {Object.keys(historyByManga).map((mangaId) => {
            const manga = mangaDetails[mangaId];
            const mangaHistoryItems = historyByManga[mangaId];

            if (!manga) return null; // Skip if manga details not found

            return (
              <Grid item xs={12} key={mangaId}>
                <Card sx={{ display: "flex", mb: 2, borderRadius: 2 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 140, objectFit: "cover" }}
                    image={
                      manga.coverImage ||
                      "https://via.placeholder.com/140x200?text=No+Cover"
                    }
                    alt={manga.title}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        component={Link}
                        to={`/manga/${mangaId}`}
                        sx={{ textDecoration: "none", color: "primary.main" }}
                      >
                        {manga.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {manga.author || "Unknown author"}
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Recently Read Chapters:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {mangaHistoryItems.slice(0, 3).map((item) => (
                          <Box
                            key={`${item.mangaId}-${item.chapterId}`}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              component={Link}
                              to={`/manga/${item.mangaId}/chapter/${item.chapterNumber}`}
                              sx={{
                                textDecoration: "none",
                                color: "primary.main",
                              }}
                            >
                              Chapter {item.chapterNumber}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDate(item.timestamp)}
                            </Typography>
                          </Box>
                        ))}
                        {mangaHistoryItems.length > 3 && (
                          <Typography variant="caption" color="text.secondary">
                            +{mangaHistoryItems.length - 3} more chapters
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default ReadingHistory;

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import mangaService from "../services/mangaService";
import authService from "../services/authService";
import readingHistoryService from "../services/readingHistoryService";
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
  Tabs,
  TextField,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  CircularProgress,
  ListItemIcon,
} from "@mui/material";
import {
  Bookmark,
  BookmarkBorder,
  ArrowBack,
  Send,
  ThumbUp,
  ThumbUpOutlined,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import categories from "../data/categories";
import CommentSection from "../components/CommentSection";

// Mock data for reviews
const mockReviews = [
  {
    id: 1,
    userId: 101,
    username: "MangaLover42",
    avatar: "https://mui.com/static/images/avatar/1.jpg",
    rating: 5,
    comment:
      "One of the best manga ever created! The world-building is incredible and the character development over the years has been amazing to follow.",
    date: "2023-04-15T10:30:00",
    likes: 24,
    userLiked: false,
  },
  {
    id: 2,
    userId: 102,
    username: "PirateKing",
    avatar: "https://mui.com/static/images/avatar/2.jpg",
    rating: 4.5,
    comment:
      "I've been following this series for years. The story arcs keep getting better and better. Can't wait to see how it all ends!",
    date: "2023-05-02T15:45:00",
    likes: 18,
    userLiked: true,
  },
  {
    id: 3,
    userId: 103,
    username: "StrawHatFan",
    avatar: "https://mui.com/static/images/avatar/3.jpg",
    rating: 5,
    comment:
      "The character development in this manga is unmatched. Each arc introduces amazing new characters while developing the existing ones.",
    date: "2023-05-10T09:20:00",
    likes: 32,
    userLiked: false,
  },
];

const MangaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [favoriteStatus, setFavoriteStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState(mockReviews);
  const [manga, setManga] = useState(null);
  const [loadingManga, setLoadingManga] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [ratingError, setRatingError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [readChapters, setReadChapters] = useState([]);
  // Use a ref instead of state to track if view has been counted
  // This will persist across re-renders and prevent double counting
  const viewCountedRef = useRef(false);

  // Fetch manga details when component mounts
  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        setLoadingManga(true);
        console.log("Current ID:", id);
        const data = await mangaService.getMangaById(id);
        console.log("Fetched manga:", data);
        setManga(data); // kiểm tra nếu cần set data.manga
        setError(null);

        // Fetch reading history for this manga
        const readChaptersData =
          await readingHistoryService.getReadChaptersForManga(id);
        setReadChapters(readChaptersData);

        // Fetch average rating and total ratings from API
        try {
          const avg = await mangaService.getAverageRating(id);
          setAverageRating(avg || 0);
        } catch (err) {
          setAverageRating(0);
        }
        try {
          const ratings = await mangaService.getMangaRatings(id);
          setTotalRatings(Array.isArray(ratings) ? ratings.length : 0);
        } catch (err) {
          setTotalRatings(0);
        }

        if (authService.isAuthenticated()) {
          const status = isFavorite(parseInt(id));
          setFavoriteStatus(status);

          // Fetch user's current rating for this manga
          try {
            const userRatingData = await mangaService.getUserRating(id);
            if (userRatingData && userRatingData.rating) {
              setUserRating(userRatingData.rating);
            }
          } catch (ratingErr) {
            console.error("Error fetching user rating:", ratingErr);
            // Don't set error state here to avoid blocking the UI
          }
        }

        // Only increment view count once per manga view session
        // Using ref instead of state to prevent double counting
        if (!viewCountedRef.current) {
          await mangaService.incrementViews(id);
          viewCountedRef.current = true;
        }
      } catch (err) {
        console.error("Error fetching manga details:", err);
        setError(err?.message || "Failed to load manga details");
      } finally {
        setLoadingManga(false);
      }
    };

    fetchMangaDetails();
  }, [id]); // Remove isFavorite from dependency array to prevent double execution

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFavoriteClick = async () => {
    // If not authenticated, redirect to login
    if (!authService.isAuthenticated()) {
      navigate("/login", { state: { from: `/manga/${id}` } });
      return;
    }

    setLoading(true);

    try {
      if (favoriteStatus) {
        const success = await removeFavorite(parseInt(id));
        if (success) {
          setFavoriteStatus(false);
        }
      } else {
        const success = await addFavorite(manga);
        if (success) {
          setFavoriteStatus(true);
        }
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = () => {
    if (newReview.trim() === "") return;

    const newReviewObj = {
      id: reviews.length + 1,
      userId: 999, // Assuming current user id
      username: "CurrentUser", // Assuming current username
      avatar: "https://mui.com/static/images/avatar/4.jpg", // Assuming current user avatar
      rating: userRating,
      comment: newReview,
      date: new Date().toISOString(),
      likes: 0,
      userLiked: false,
    };

    setReviews([newReviewObj, ...reviews]);
    setNewReview("");
  };

  const handleLikeReview = (reviewId) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === reviewId) {
          const newLikeStatus = !review.userLiked;
          return {
            ...review,
            likes: newLikeStatus ? review.likes + 1 : review.likes - 1,
            userLiked: newLikeStatus,
          };
        }
        return review;
      })
    );
  };

  // Show loading state or error message if applicable
  if (loadingManga) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Typography variant="h5">Loading manga details...</Typography>
      </Container>
    );
  }

  if (error) {
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
          <Typography variant="h5" color="error">
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Don't render the content if manga is null
  if (!manga) {
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
          <Typography variant="h5">Manga not found</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button component={Link} to="/" startIcon={<ArrowBack />} sx={{ mb: 2 }}>
        Back to Browse
      </Button>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Manga Cover */}
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={manga.coverImage}
              alt={manga.title}
              sx={{
                width: "100%",
                maxHeight: 500,
                objectFit: "cover",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
            <Button
              variant="contained"
              fullWidth
              color="primary"
              sx={{ mt: 2 }}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : favoriteStatus ? (
                  <Bookmark />
                ) : (
                  <BookmarkBorder />
                )
              }
              onClick={handleFavoriteClick}
              disabled={loading || loadingManga}
            >
              {favoriteStatus ? "Remove from Favorites" : "Add to Favorites"}
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

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={averageRating || 0} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {(averageRating || 0).toFixed(1)} / 5 ({totalRatings || 0}{" "}
                ratings)
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating
                name="user-manga-rating"
                value={userRating}
                precision={1}
                onChange={async (event, newValue) => {
                  if (!authService.isAuthenticated()) {
                    navigate("/login", { state: { from: `/manga/${id}` } });
                    return;
                  }

                  setUserRating(newValue);
                  setRatingLoading(true);
                  setRatingSuccess(false);
                  setRatingError(null);

                  try {
                    await mangaService.rateManga(id, newValue);
                    // Refresh manga details to update average rating
                    const updatedManga = await mangaService.getMangaById(id);
                    setManga(updatedManga);
                    // Refresh average rating and total ratings
                    try {
                      const avg = await mangaService.getAverageRating(id);
                      setAverageRating(avg || 0);
                    } catch (err) {
                      setAverageRating(0);
                    }
                    try {
                      const ratings = await mangaService.getMangaRatings(id);
                      setTotalRatings(
                        Array.isArray(ratings) ? ratings.length : 0
                      );
                    } catch (err) {
                      setTotalRatings(0);
                    }
                    setRatingSuccess(true);

                    // Clear success message after 3 seconds
                    setTimeout(() => setRatingSuccess(false), 3000);
                  } catch (error) {
                    console.error("Error rating manga:", error);
                    setRatingError(
                      "Failed to save your rating. Please try again."
                    );

                    // Clear error message after 3 seconds
                    setTimeout(() => setRatingError(null), 3000);
                  } finally {
                    setRatingLoading(false);
                  }
                }}
                disabled={!authService.isAuthenticated() || ratingLoading}
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {authService.isAuthenticated()
                    ? "Your rating"
                    : "Login to rate"}
                </Typography>
                {ratingLoading && <CircularProgress size={16} sx={{ ml: 1 }} />}
                {ratingSuccess && (
                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{ ml: 1 }}
                  >
                    Rating saved!
                  </Typography>
                )}
                {ratingError && (
                  <Typography variant="body2" color="error" sx={{ ml: 1 }}>
                    {ratingError}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              {Array.isArray(manga.categories) &&
                manga.categories.map((category) => {
                  // Tìm slug tương ứng trong danh sách categories tổng thể
                  const matchedCategory = categories.find(
                    (cat) =>
                      cat.name.toLowerCase() === category.name.toLowerCase()
                  );
                  const categorySlug = matchedCategory
                    ? matchedCategory.slug
                    : "";

                  return (
                    <Link
                      key={category.id}
                      to={`/categories/${category.name}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Chip
                        label={category.name}
                        color="primary"
                        variant="outlined"
                        clickable
                      />
                    </Link>
                  );
                })}
            </Box>

            <Typography variant="body1" paragraph>
              {manga.description}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs for Chapters and Reviews */}
      <Box sx={{ width: "100%", mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="manga content tabs"
          >
            <Tab label="Chapters" id="manga-tab-0" />
            <Tab label="Reviews" id="manga-tab-1" />
            <Tab label="Related" id="manga-tab-2" />
          </Tabs>
        </Box>

        {/* Chapters Tab */}
        <div role="tabpanel" hidden={tabValue !== 0}>
          {tabValue === 0 && (
            <List>
              {manga.chapters.map((chapter, index) => {
                // Check if this chapter has been read
                const isRead = readChapters.some(
                  (item) => item.chapterId === chapter.id
                );

                return (
                  <div key={chapter.id}>
                    <ListItem
                      button
                      component={Link}
                      to={`/manga/${manga.id}/chapter/${chapter.chapterNumber}`}
                      onClick={() => {
                        // Add to reading history when clicked
                        readingHistoryService.addToReadingHistory(
                          manga.id,
                          chapter.id,
                          chapter.chapterNumber
                        );
                      }}
                      sx={{
                        backgroundColor: isRead
                          ? "rgba(25, 118, 210, 0.08)"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: isRead
                            ? "rgba(25, 118, 210, 0.12)"
                            : "rgba(0, 0, 0, 0.04)",
                        },
                        borderLeft: isRead ? "4px solid #1976d2" : "none",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {isRead ? (
                          <CheckCircle color="primary" fontSize="small" />
                        ) : (
                          <RadioButtonUnchecked
                            color="action"
                            fontSize="small"
                          />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${chapter.title}`}
                        secondary={`Released: ${new Date(
                          chapter.createdAt
                        ).toLocaleDateString()}`}
                        primaryTypographyProps={{
                          color: isRead ? "primary" : "inherit",
                          fontWeight: isRead ? 500 : 400,
                        }}
                      />
                    </ListItem>
                    {index < manga.chapters.length - 1 && <Divider />}
                  </div>
                );
              })}
            </List>
          )}
        </div>

        {/* Comments Tab */}
        <div role="tabpanel" hidden={tabValue !== 1}>
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              {/* Import and use the CommentSection component */}
              <CommentSection mangaId={id} />
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

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  Bookmark,
  BookmarkBorder,
  ArrowBack,
  Send,
  ThumbUp,
  ThumbUpOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import categories from "../data/categories";

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

// Mock data for a single manga
const mockMangaDetails = {
  1: {
    id: 1,
    title: "One Piece",
    cover: "https://m.media-amazon.com/images/I/51FXs5gTmdL._SY445_SX342_.jpg",
    author: "Eiichiro Oda",
    rating: 4.8,
    genres: ["Adventure", "Action", "Fantasy"],
    status: "Ongoing",
    releaseYear: 1999,
    description:
      'Gol D. Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.',
    chapters: [
      { number: 1, title: "Romance Dawn", date: "1999-07-22" },
      {
        number: 2,
        title: 'They Call Him "Straw Hat Luffy"',
        date: "1999-07-29",
      },
      { number: 3, title: "Morgan versus Luffy", date: "1999-08-05" },
      {
        number: 4,
        title: "Marine Captain Axe-Hand Morgan",
        date: "1999-08-12",
      },
      {
        number: 5,
        title: "Pirate King and Great Swordsman",
        date: "1999-08-19",
      },
      { number: 6, title: "The First Person", date: "1999-08-26" },
      { number: 7, title: "Friends", date: "1999-09-02" },
      { number: 8, title: "Introducing Nami", date: "1999-09-09" },
      { number: 9, title: "The Devil Girl", date: "1999-09-16" },
      { number: 10, title: "The Incident at the Bar", date: "1999-09-23" },
    ],
  },
  // Add more manga details as needed
};

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
  const [userRating, setUserRating] = useState(5);

  // Fetch manga details when component mounts
  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        setLoadingManga(true);
        const data = await mangaService.getMangaById(id);
        setManga(data);
        setError(null);

        // Check if manga is in favorites
        if (authService.isAuthenticated()) {
          const status = isFavorite(parseInt(id));
          setFavoriteStatus(status);
        }
      } catch (err) {
        console.error("Error fetching manga details:", err);
        setError("Failed to load manga details");
      } finally {
        setLoadingManga(false);
      }
    };

    fetchMangaDetails();
  }, [id, isFavorite]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFavoriteClick = async () => {
    // If not authenticated, redirect to login
    if (!authService.isAuthenticated()) {
      navigate("/signin", { state: { from: `/manga/${id}` } });
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
              src={manga.cover}
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
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : favoriteStatus ? <Bookmark /> : <BookmarkBorder />}
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
              <Rating value={manga.rating} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {manga.rating} / 5
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              {manga.genres.map((genre, index) => {
                // Find the category slug for the genre
                const category = categories.find(
                  (cat) => cat.name.toLowerCase() === genre.toLowerCase()
                );
                const categorySlug = category ? category.slug : "";

                return (
                  <Link
                    key={index}
                    to={`/category/${categorySlug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Chip
                      label={genre}
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
              {manga.chapters.map((chapter, index) => (
                <div key={chapter.number}>
                  <ListItem
                    button
                    component={Link}
                    to={`/manga/${manga.id}/chapter/${chapter.number}`}
                  >
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
              {/* Review submission form */}
              <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Write a Review
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography component="legend" sx={{ mr: 1 }}>
                    Your Rating:
                  </Typography>
                  <Rating
                    name="user-rating"
                    value={userRating}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      setUserRating(newValue);
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Share your thoughts about this manga..."
                    variant="outlined"
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<Send />}
                    onClick={handleReviewSubmit}
                    disabled={newReview.trim() === ""}
                  >
                    Post Review
                  </Button>
                </Box>
              </Paper>

              {/* Reviews list */}
              <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
                Reader Reviews ({reviews.length})
              </Typography>

              {reviews.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {reviews.map((review) => (
                    <Card key={review.id} sx={{ mb: 2 }}>
                      <CardHeader
                        avatar={
                          <Avatar src={review.avatar} alt={review.username}>
                            {review.username.charAt(0)}
                          </Avatar>
                        }
                        title={review.username}
                        subheader={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 0.5,
                            }}
                          >
                            <Rating
                              value={review.rating}
                              precision={0.5}
                              size="small"
                              readOnly
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              {new Date(review.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </Typography>
                          </Box>
                        }
                      />
                      <CardContent sx={{ pt: 0 }}>
                        <Typography variant="body1" paragraph>
                          {review.comment}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleLikeReview(review.id)}
                            color={review.userLiked ? "primary" : "default"}
                          >
                            {review.userLiked ? (
                              <ThumbUp />
                            ) : (
                              <ThumbUpOutlined />
                            )}
                          </IconButton>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 0.5 }}
                          >
                            {review.likes}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No reviews yet. Be the first to share your thoughts!
                  </Typography>
                </Box>
              )}
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
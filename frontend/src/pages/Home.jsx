import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Pagination,
  Paper,
  Divider,
  Button,
  Stack,
  Avatar,
  InputBase,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  TrendingUp,
  Update,
  Whatshot,
  Search as SearchIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import MangaCard from "../components/MangaCard";
import FeaturedCarousel from "../components/FeaturedCarousel";
import { Link } from "react-router-dom";
import mangaService from "../services/mangaService";
import categoryService from "../services/categoryService";
import CONFIG from "../config";
const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [mangas, setMangas] = useState([]);
  const [featuredMangas, setFeaturedMangas] = useState([]);
  const [latestMangas, setLatestMangas] = useState([]);
  const [hottestMangas, setHottestMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const mangasPerPage = 8;

  // Fetch mangas when component mounts
  useEffect(() => {
    const fetchMangas = async () => {
      try {
        setLoading(true);

        // Fetch all mangas with pagination
        const mangasData = await mangaService.getAllMangas(
          currentPage - 1,
          mangasPerPage
        );
        console.log("Mangas data:", mangasData);

        // Check if the response has the expected structure with content array
        if (mangasData && mangasData.content) {
          // Ensure content is always treated as an array
          if (Array.isArray(mangasData.content)) {
            console.log(
              "Content is an array with",
              mangasData.content.length,
              "items"
            );
            // Make sure we're setting all items from the content array
            setMangas(mangasData.content);
          } else {
            // If content exists but is not an array (possibly a single object), convert to array
            console.log("Content is not an array, converting to array");
            setMangas([mangasData.content]);
          }
          // Set total pages from the API response
          setTotalPages(mangasData.totalPages || 1);
        } else if (Array.isArray(mangasData)) {
          // If the response itself is an array, use it directly
          console.log("Response is an array, using directly");
          setMangas(mangasData);
          // Calculate total pages if not provided
          setTotalPages(Math.ceil(mangasData.length / mangasPerPage) || 1);
        } else if (mangasData) {
          // If response is an object but not in expected format, wrap it
          console.log("Response is not in expected format, wrapping in array");
          setMangas([mangasData]);
          setTotalPages(1);
        } else {
          console.log("No valid data found, setting empty array");
          setMangas([]);
          setTotalPages(1);
        }

        // Fetch featured mangas
        const featuredData = await mangaService.getFeaturedMangas();
        setFeaturedMangas(featuredData);

        // Fetch latest updates
        const latestData = await mangaService.getLatestUpdates(0, 8);
        console.log("Dữ liệu latestData:", latestData); // ← 🟡 đặt ở đây

        if (latestData && Array.isArray(latestData.content)) {
          setLatestMangas(latestData.content);
        } else {
          console.warn("Không tìm thấy content hợp lệ:", latestData);
          setLatestMangas([]);
        }

        // Fetch most viewed mangas for HOTTEST section
        try {
          const hottestData = await mangaService.getMostViewedMangas(7);
          setHottestMangas(hottestData);
          console.log("Hottest manga data:", hottestData);
        } catch (error) {
          console.error("Error fetching hottest mangas:", error);
          setHottestMangas([]);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching mangas:", err);
        setError("Failed to load manga data");
      } finally {
        setLoading(false);
      }
    };

    fetchMangas();
  }, [currentPage]);

  // Handle search
  useEffect(() => {
    const searchMangas = async () => {
      if (searchQuery.trim() === "") return;

      try {
        setLoading(true);
        const searchResults = await mangaService.searchMangas(
          searchQuery,
          0,
          mangasPerPage
        );
        setMangas(searchResults.content);
        setTotalPages(searchResults.totalPages);
      } catch (err) {
        console.error("Error searching mangas:", err);
        setError("Failed to search manga");
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        searchMangas();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <FeaturedCarousel
        mangas={featuredMangas.length > 0 ? featuredMangas : []}
      />

      {/* Search Area */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          py: 3,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="xl">
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim() !== "") {
                window.location.href = `/search?q=${encodeURIComponent(
                  searchQuery
                )}`;
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: alpha("#ffffff", 0.15),
              borderRadius: 2,
              overflow: "hidden",
              maxWidth: 700,
              mx: "auto",
              "&:hover": {
                backgroundColor: alpha("#ffffff", 0.25),
              },
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", flexGrow: 1, px: 2 }}
            >
              <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              <InputBase
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  color: "text.primary",
                  width: "100%",
                  "& .MuiInputBase-input": {
                    py: 1.5,
                  },
                }}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                py: 1.5,
                minWidth: "100px",
              }}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Main Content Area - 9 columns on large screens */}
          <Grid item xs={12} lg={9}>
            {/* Daily Updates Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Update color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2" fontWeight="bold">
                  DAILY UPDATES
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {latestMangas?.map((manga) => (
                  <Grid item key={manga.id} xs={6} sm={3}>
                    <Paper
                      component={Link}
                      to={`/manga/${manga.id}`}
                      elevation={2}
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 2,
                        transition: "transform 0.3s",
                        bgcolor: "#1e1e1e",
                        textDecoration: "none",
                        display: "block",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          "& .chapter-info": { backgroundColor: "#ff6740" },
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={manga.coverImage}
                        alt={manga.title}
                        sx={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        className="chapter-info"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          backgroundColor: "rgba(0,0,0,0.7)",
                          p: 1,
                          transition: "background-color 0.3s",
                        }}
                      >
                        <Typography variant="body2" noWrap fontWeight="bold">
                          {manga.title}
                        </Typography>
                        <Typography variant="caption" display="block">
                          Chapter{" "}
                          {manga.chapters && manga.chapters.length > 0
                            ? Math.max(
                                ...manga.chapters.map((c) => c.chapterNumber)
                              )
                            : "N/A"}{" "}
                          •{" "}
                          {manga.createdAt
                            ? new Date(manga.createdAt).toLocaleDateString()
                            : "Recent"}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  component={Link}
                  to="/updates"
                  size="small"
                  endIcon={<TrendingUp />}
                >
                  View All Updates
                </Button>
              </Box>
            </Box>

            {/* All Manga Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2" fontWeight="bold">
                  ALL MANGA
                </Typography>
              </Box>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <CircularProgress size={60} />
                </Box>
              ) : error ? (
                <Box sx={{ py: 4 }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              ) : mangas && mangas.length > 0 ? (
                <Grid container spacing={3}>
                  {mangas.map((manga) => (
                    <Grid item key={manga.id} xs={12} sm={6} md={4} lg={4}>
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
                    height: "30vh",
                  }}
                >
                  <Typography variant="h5" color="text.secondary">
                    {searchQuery
                      ? "No manga found matching your search"
                      : "No manga available"}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            </Box>
          </Grid>

          {/* Sidebar - 3 columns on large screens */}
          <Grid item xs={12} lg={3}>
            <Box sx={{ position: { lg: "sticky" }, top: { lg: 20 } }}>
              {/* Hottest Manga Section */}
              <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Whatshot color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    HOTTEST
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  {(hottestMangas.length > 0
                    ? hottestMangas
                    : mangas.slice(0, 7)
                  ).map((manga, index) => (
                    <Paper
                      key={manga.id}
                      component={Link}
                      to={`/manga/${manga.id}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        textDecoration: "none",
                        color: "inherit",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "translateX(8px)",
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 24,
                          height: 24,
                          fontSize: "0.875rem",
                          mr: 1,
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Box
                        component="img"
                        src={manga.coverImage}
                        alt={manga.title}
                        sx={{
                          width: 50,
                          height: 70,
                          objectFit: "cover",
                          borderRadius: 1,
                          mr: 1,
                        }}
                      />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap fontWeight="bold">
                          {manga.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                          noWrap
                        >
                          {manga.author}
                        </Typography>
                        <Typography variant="caption" color="primary">
                          {parseInt(manga.views).toLocaleString()} views
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Paper>

              {/* Promotions Section */}
              <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  PROMOTIONS
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  {[
                    {
                      id: 1,
                      title: "Monthly VIP Subscription",
                      description:
                        "Get unlimited access to all manga for just $1.25/month",
                      image: `${CONFIG.BACKEND_URL}/vip/monthly_vip.jpeg`,
                    },
                    {
                      id: 2,
                      title: "Yearly VIP Subscription",
                      description:
                        "Get unlimited access to all manga for just $12.5/year",
                      image: `${CONFIG.BACKEND_URL}/vip/yearly_vip.jpeg`,
                    },
                  ].map((promo) => (
                    <Paper
                      key={promo.id}
                      elevation={1}
                      component={Link}
                      to="/vip-subscription"
                      sx={{
                        overflow: "hidden",
                        borderRadius: 2,
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "inherit",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          boxShadow: 6,
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={promo.image}
                        alt={promo.title}
                        sx={{
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                        }}
                      />
                      <Box sx={{ p: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {promo.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {promo.description}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          Subscribe Now
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Paper>

              {/* Popular Tags Section */}
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  POPULAR TAGS
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {[
                    "Action",
                    "Adventure",
                    "Comedy",
                    "Drama",
                    "Fantasy",
                    "Horror",
                    "Mystery",
                    "Romance",
                    "Sci-Fi",
                    "Slice of Life",
                    "Sports",
                    "Supernatural",
                  ].map((tag) => (
                    <Button
                      key={tag}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: 4,
                        textTransform: "none",
                        mb: 1,
                      }}
                    >
                      {tag}
                    </Button>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;

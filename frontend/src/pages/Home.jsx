import { useState } from "react";
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

// Mock data for manga list
const mockMangas = [
  {
    id: 1,
    title: "One Piece",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Eiichiro Oda",
    rating: 4.8,
    views: "353691",
    genres: ["Adventure", "Action", "Fantasy"],
  },
  {
    id: 2,
    title: "Naruto",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Masashi Kishimoto",
    rating: 4.7,
    views: "339747",
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: 3,
    title: "Attack on Titan",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Hajime Isayama",
    rating: 4.9,
    views: "283968",
    genres: ["Action", "Drama", "Fantasy"],
  },
  {
    id: 4,
    title: "My Hero Academia",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Kohei Horikoshi",
    rating: 4.6,
    views: "226328",
    genres: ["Action", "Superhero", "School"],
  },
  {
    id: 5,
    title: "Demon Slayer",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Koyoharu Gotouge",
    rating: 4.8,
    views: "202821",
    genres: ["Action", "Supernatural", "Historical"],
  },
  {
    id: 6,
    title: "Jujutsu Kaisen",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Gege Akutami",
    rating: 4.7,
    views: "171212",
    genres: ["Action", "Supernatural", "School"],
  },
  {
    id: 7,
    title: "Dragon Ball",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Akira Toriyama",
    rating: 4.8,
    views: "168421",
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: 8,
    title: "Death Note",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tsugumi Ohba",
    rating: 4.9,
    views: "156324",
    genres: ["Mystery", "Psychological", "Supernatural"],
  },
  {
    id: 9,
    title: "Death Note",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tsugumi Ohba",
    rating: 4.9,
    views: "156324",
    genres: ["Mystery", "Psychological", "Supernatural"],
  },
  {
    id: 10,
    title: "Death Note",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tsugumi Ohba",
    rating: 4.9,
    views: "156324",
    genres: ["Mystery", "Psychological", "Supernatural"],
  },
  {
    id: 11,
    title: "Death Note",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tsugumi Ohba",
    rating: 4.9,
    views: "156324",
    genres: ["Mystery", "Psychological", "Supernatural"],
  },
  {
    id: 12,
    title: "Death Note",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tsugumi Ohba",
    rating: 4.9,
    views: "156324",
    genres: ["Mystery", "Psychological", "Supernatural"],
  },
  {
    id: 13,
    title: "Death Note",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tsugumi Ohba",
    rating: 4.9,
    views: "156324",
    genres: ["Mystery", "Psychological", "Supernatural"],
  },
  {
    id: 14,
    title: "Death Note",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tsugumi Ohba",
    rating: 4.9,
    views: "156324",
    genres: ["Mystery", "Psychological", "Supernatural"],
  },
  {
    id: 15,
    title: "Death Note",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tsugumi Ohba",
    rating: 4.9,
    views: "156324",
    genres: ["Mystery", "Psychological", "Supernatural"],
  },
  {
    id: 16,
    title: "Death Note",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tsugumi Ohba",
    rating: 4.9,
    views: "156324",
    genres: ["Mystery", "Psychological", "Supernatural"],
  },
  {
    id: 17,
    title: "Death Note",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    author: "Tsugumi Ohba",
    rating: 4.9,
    views: "156324",
    genres: ["Mystery", "Psychological", "Supernatural"],
  },
];

// Mock data for daily updates
const dailyUpdates = [
  {
    id: 1,
    title: "One Piece",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    chapter: 1084,
    updatedAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Naruto",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    chapter: 702,
    updatedAt: "5 hours ago",
  },
  {
    id: 3,
    title: "Attack on Titan",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    chapter: 139,
    updatedAt: "1 day ago",
  },
  {
    id: 4,
    title: "My Hero Academia",
    cover: "https://m.media-amazon.com/images/I/91M9VaZWxOL._SY466_.jpg",
    chapter: 362,
    updatedAt: "2 days ago",
  },
];

// Mock promotional content
const promotions = [
  {
    id: 1,
    title: "Manga Plus Subscription",
    description: "Get unlimited access to all manga for just $4.99/month",
    image:
      "https://cdn.pixabay.com/photo/2016/12/28/08/15/hatsune-miku-1935674_1280.png",
  },
  {
    id: 2,
    title: "New Releases",
    description: "Check out the latest manga releases this week",
    image:
      "https://cdn.pixabay.com/photo/2023/05/28/05/34/ai-generated-8022486_1280.jpg",
  },
];

const Home = () => {
  const [page, setPage] = useState(1);
  const mangasPerPage = 8;
  const totalPages = Math.ceil(mockMangas.length / mangasPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get current mangas
  const indexOfLastManga = page * mangasPerPage;
  const indexOfFirstManga = indexOfLastManga - mangasPerPage;
  const currentMangas = mockMangas.slice(indexOfFirstManga, indexOfLastManga);

  return (
    <>
      <FeaturedCarousel />

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
                {dailyUpdates.map((manga) => (
                  <Grid item key={manga.id} xs={6} sm={3}>
                    <Paper
                      elevation={2}
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 2,
                        transition: "transform 0.3s",
                        bgcolor: "#1e1e1e",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          "& .chapter-info": { backgroundColor: "#ff6740" },
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={manga.cover}
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
                          Chapter {manga.chapter} • {manga.updatedAt}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button size="small" endIcon={<TrendingUp />}>
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
              <Grid container spacing={3}>
                {mockMangas.map((manga) => (
                  <Grid item key={manga.id} xs={12} sm={6} md={4} lg={4}>
                    <MangaCard manga={manga} />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
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
                  {mockMangas.slice(0, 7).map((manga, index) => (
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
                        src={manga.cover}
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
                  {promotions.map((promo) => (
                    <Paper
                      key={promo.id}
                      elevation={1}
                      sx={{
                        overflow: "hidden",
                        borderRadius: 2,
                        "&:hover": {
                          boxShadow: 6,
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

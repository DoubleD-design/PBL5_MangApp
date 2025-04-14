import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
  Box,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import categoryService from "../services/categoryService";

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/categories/${categorySlug}`);
    handleCategoryClose();
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#000000", borderRadius: 0 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 4,
              fontWeight: "bold",
              color: "#ff6740",
              fontSize: "1.8rem",
              whiteSpace: "normal",
              textDecoration: "none",
            }}
          >
            <Box
              // component="img"
              src="/manga-logo.png"
              alt="MangaPlus"
              sx={{ height: 40, mr: 1, display: { xs: "none", md: "flex" } }}
            />
            MANGA<span style={{ color: "#ffffff" }}>VN</span>
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}>
            <Button component={Link} to="/" color="inherit" sx={{ mx: 1 }}>
              HOME
            </Button>
            <Button
              component={Link}
              to="/categories"
              color="inherit"
              sx={{ mx: 1 }}
              onMouseEnter={handleCategoryOpen}
              aria-controls="categories-menu"
              aria-haspopup="true"
            >
              CATEGORIES
            </Button>
            <Menu
              id="categories-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCategoryClose}
              MenuListProps={{
                onMouseLeave: handleCategoryClose,
              }}
              PaperProps={{
                style: {
                  maxWidth: "none",
                  width: "600px",
                  maxHeight: "400px",
                  padding: "10px",
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  marginTop: "8px",
                },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1,
                  p: 1,
                }}
              >
                {loading ? (
                  <Box
                    sx={{ p: 2, textAlign: "center", gridColumn: "1 / span 3" }}
                  >
                    Loading categories...
                  </Box>
                ) : error ? (
                  <Box
                    sx={{
                      p: 2,
                      textAlign: "center",
                      gridColumn: "1 / span 3",
                      color: "error.main",
                    }}
                  >
                    {error}
                  </Box>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <MenuItem
                      key={category.id}
                      onClick={() => handleCategoryClick(category.name)}
                      sx={{
                        py: 1,
                        borderRadius: "4px",
                        "&:hover": {
                          backgroundColor: "rgba(255, 103, 64, 0.1)",
                          color: "#ff6740",
                        },
                      }}
                    >
                      {category.name}
                    </MenuItem>
                  ))
                ) : (
                  <Box
                    sx={{ p: 2, textAlign: "center", gridColumn: "1 / span 3" }}
                  >
                    No categories found
                  </Box>
                )}
              </Box>
            </Menu>
            <Button
              color="inherit"
              component={Link}
              to="/updates"
              sx={{ mx: 1 }}
            >
              UPDATES
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/ranking"
              sx={{ mx: 1, whiteSpace: "nowrap", minWidth: "auto" }}
            >
              RANKING
            </Button>
            <Button
              color="inherit"
              sx={{ mx: 1, whiteSpace: "nowrap", minWidth: "auto" }}
            >
              SUGGEST
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/favorites"
              sx={{ mx: 1, whiteSpace: "nowrap", minWidth: "auto" }}
            >
              FAVORITED
            </Button>
            <Button
              component={Link}
              to="/about-us"
              color="inherit"
              sx={{ mx: 1 }}
            >
              ABOUT US
            </Button>
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              component={Link}
              to="/signin"
              variant="outlined"
              sx={{
                color: "#fff",
                borderColor: "#fff",
                "&:hover": {
                  borderColor: "#ff6740",
                  backgroundColor: "rgba(255, 103, 64, 0.1)",
                },
              }}
            >
              LOG IN
            </Button>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              sx={{
                backgroundColor: "#ff6740",
                "&:hover": {
                  backgroundColor: "#ff8a65",
                },
              }}
            >
              REGISTER
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

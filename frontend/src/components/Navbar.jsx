import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
  Box,
  Container,
} from "@mui/material";
import { Link } from 'react-router-dom';

const Navbar = () => {
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
            <Button 
              component={Link}
              to="/"
              color="inherit" 
              sx={{ mx: 1 }}
            >
              HOME
            </Button>
            <Button color="inherit" sx={{ mx: 1 }}>
              UPDATES
            </Button>
            <Button
              component={Link}
              to="/ranking"
              color="inherit"
              sx={{ mx: 1 }}
            >
              RANKING
            </Button>
            <Button
              color="inherit"
              sx={{ mx: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}
            >
              SUGGEST
            </Button>
            <Button
              color="inherit"
              sx={{ mx: 1, whiteSpace: "nowrap", minWidth: "auto" }}
            >
              CREATORS
            </Button>
            <Button
              color="inherit"
              sx={{ mx: 1, whiteSpace: "nowrap", minWidth: "auto" }}
            >
              FAVORITED
            </Button>
            <Button
              color="inherit"
              sx={{ mx: 1, whiteSpace: "nowrap", minWidth: "auto" }}
            >
              ABOUT US
            </Button>
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
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

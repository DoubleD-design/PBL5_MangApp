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
import { Search as SearchIcon } from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  [theme.breakpoints.up("md")]: {
    width: "300px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "28ch",
    },
  },
}));

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#000000", borderRadius: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 4,
              fontWeight: "bold",
              color: "#ff6740",
              fontSize: "1.8rem",
              whiteSpace: "normal"
            }}
          >
            <Box
              // component="img"
              src="/manga-logo.png"
              alt="MangaPlus"
              sx={{ height: 40, mr: 1, display: { xs: "none", md: "flex" } }}
            />
            MANGA<span style={{ color: "#ffffff" }}>Plus</span>
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}>
            <Button color="inherit" sx={{ mx: 1 }}>
              UPDATES
            </Button>
            <Button color="inherit" sx={{ mx: 1 }}>
              FEATURED
            </Button>
            <Button color="inherit" sx={{ mx: 1 }}>
              RANKING
            </Button>
            <Button color="inherit" sx={{ mx: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}>
              MANGA LIST
            </Button>
            <Button color="inherit" sx={{ mx: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}>
              CREATORS
            </Button>
            <Button color="inherit" sx={{ mx: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}>
              FAVORITED
            </Button>
            <Button color="inherit" sx={{ mx: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}>
              ABOUT US
            </Button>
          </Box>

          {/* Search */}
          <Search sx={{ flexGrow: 0, width: 'auto', ml: 2 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search by title or author"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

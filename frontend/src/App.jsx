import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MangaDetail from "./pages/MangaDetail";
import ChapterReader from "./components/ChapterReader";
import Ranking from "./pages/Ranking";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import Login from "./pages/LogIn";
import CategoryPage from "./pages/CategoryPage";
import UpdatesPage from "./pages/UpdatesPage";
import FavoritesPage from "./pages/FavoritesPage";
import { FavoritesProvider } from "./context/FavoritesContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FavoritesProvider>
        <Router>
          <Box
            sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
          >
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/manga/:id" element={<MangaDetail />} />
              <Route
                path="/manga/:mangaId/chapter/:chapterNumber"
                element={<ChapterReader />}
              />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/signin" element={<Login />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/updates" element={<UpdatesPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;

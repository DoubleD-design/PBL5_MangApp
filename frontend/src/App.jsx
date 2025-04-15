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
import LogIn from "./pages/LogIn";
import CategoryPage from "./pages/CategoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import UpdatesPage from "./pages/UpdatesPage";
import FavoritesPage from "./pages/FavoritesPage";
import { FavoritesProvider } from "./context/FavoritesContext";
import { Navigate } from "react-router-dom";
import authService from "./services/authService";
import UserProfile from "./pages/UserProfile";
// PrivateRoute component
const PrivateRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FavoritesProvider>
        <Router>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
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
                <Route path="/login" element={<LogIn />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/categories/:categorySlug"
                  element={<CategoryPage />}
                />
                <Route path="/updates" element={<UpdatesPage />} />
                <Route path="/profile/edit" element={<UserProfile />} />
                {/*<Route path="/favorites" element={<FavoritesPage />} />*/}
                {/* Protect FavoritesPage with PrivateRoute */}
                <Route
                  path="/favorites"
                  element={
                    <PrivateRoute>
                      <FavoritesPage />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Box>
          </Box>
        </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;

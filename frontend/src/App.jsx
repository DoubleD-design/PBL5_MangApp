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
import SearchPage from "./pages/SearchPage";
import CategoryPage from "./pages/CategoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import UpdatesPage from "./pages/UpdatesPage";
import FavoritesPage from "./pages/FavoritesPage";
import { FavoritesProvider } from "./context/FavoritesContext";
import { Navigate } from "react-router-dom";
import authService from "./services/authService";
import UserProfile from "./pages/UserProfile";
import ChangePass from "./pages/ChangePass";
import ManageAccount from "./pages/ManageAccount";
import MyComment from "./pages/MyComment"; // Import the MyComment component
import { UserProvider } from "./context/UserContext";
import AdminDashboard from "./pages/admin/AdminDashboard"; // Import AdminDashboard component
import ChapterManagement from "./pages/admin/ChapterManagement"; // Import ChapterManagement component

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};

// AdminRoute component - checks for both authentication and admin role
const AdminRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  const isAdmin = user && user.role === "ADMIN";

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return isAdmin ? children : <Navigate to="/" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FavoritesProvider>
        <UserProvider>
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
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/categories/:categorySlug"
                    element={<CategoryPage />}
                  />
                  <Route path="/updates" element={<UpdatesPage />} />
                  <Route path="/account" element={<ManageAccount />} />
                  <Route
                    path="/account/profile/edit"
                    element={<UserProfile />}
                  />
                  <Route
                    path="/account/password/edit"
                    element={<ChangePass />}
                  />
                  <Route path="/account/comments" element={<MyComment />} />{" "}
                  {/* New route for comments */}
                  {/* Protect FavoritesPage with PrivateRoute */}
                  <Route
                    path="/favorites"
                    element={
                      <PrivateRoute>
                        <FavoritesPage />
                      </PrivateRoute>
                    }
                  />
                  {/* Admin Dashboard Route */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  {/* Route for chapter management per manga */}
                  <Route
                    path="/admin/manga/:mangaId/chapters"
                    element={
                      <AdminRoute>
                        <ChapterManagement />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </Box>
            </Box>
          </Router>
        </UserProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;

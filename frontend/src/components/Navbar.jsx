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
  Badge,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import categoryService from "../services/categoryService";
import { AccountCircle, Notifications } from "@mui/icons-material";
import authService from "../services/authService"; // Import authService
import notificationService from "../services/notificationService"; // Thêm dòng này

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAuthenticated = authService.isAuthenticated(); // Check authentication status
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Tách hàm fetchNotifications để có thể gọi lại sau khi đánh dấu đã đọc
  const fetchNotifications = async () => {
    if (authService.isAuthenticated()) {
      try {
        setNotificationLoading(true);
        const user = authService.getCurrentUser();
        const data = await notificationService.getNotificationsByUserId(user.id);
        setNotifications(data || []);
        setUnreadCount((data || []).filter(n => !n.isRead).length);
      } catch (err) {
        setNotifications([]);
        setUnreadCount(0);
      } finally {
        setNotificationLoading(false);
      }
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

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
    fetchNotifications();
    // Có thể thêm event listener để realtime hơn nếu muốn
  }, []);

  // Đánh dấu 1 thông báo là đã đọc và mở detail manga
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await notificationService.markAsRead(notification.id);
      await fetchNotifications();
    }
    let mangaId = null;
    if (notification.mangaId) {
      mangaId = notification.mangaId;
    } else {
      const match = notification.message.match(/Manga ID: (\d+)/);
      if (match) {
        mangaId = match[1];
      }
    }
    if (mangaId) {
      // If it's a comment notification, scroll to comment section
      if (
        notification.message &&
        notification.message.toLowerCase().includes("new comment")
      ) {
        navigate(`/manga/${mangaId}#comments`);
      } else {
        navigate(`/manga/${mangaId}`);
      }
      handleNotificationClose();
    }
  };

  // Đánh dấu tất cả là đã đọc
  const handleMarkAllAsRead = async () => {
    const user = authService.getCurrentUser();
    await notificationService.markAllAsRead(user.id);
    await fetchNotifications(); // Luôn lấy lại từ API để đảm bảo trạng thái đúng với DB
  };

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

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleAccountOpen = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAccountAnchorEl(null);
  };

  const handleAccountClick = (action) => {
    if (action === "logout") {
      authService.logout(); // Log out the user
      navigate("/login");
    } else if (action === "editProfile") {
      navigate("/account");
    } else if (action === "vipRegistration") {
      navigate("/vip-subscription");
    } else if (action === "adminDashboard") {
      navigate("/admin");
    }
    handleAccountClose();
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
                  width: `${Math.max(
                    600,
                    Math.ceil(categories.length / 8) * 200
                  )}px`,
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
                  gridTemplateColumns: `repeat(${Math.ceil(
                    categories.length / 8
                  )}, 1fr)`,
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
            {isAuthenticated ? (
              <>
                {/* Notification Icon */}
                <IconButton
                  onClick={handleNotificationOpen}
                  sx={{
                    color: "#fff",
                    fontSize: "1.8rem",
                    "&:hover": {
                      color: "#ff6740",
                    },
                  }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
                <Menu
                  anchorEl={notificationAnchorEl}
                  open={Boolean(notificationAnchorEl)}
                  onClose={handleNotificationClose}
                  PaperProps={{
                    style: {
                      backgroundColor: "#1a1a1a",
                      color: "#fff",
                      marginTop: "8px",
                      minWidth: 340,
                      maxWidth: 400,
                      width: 360,
                      maxHeight: "80vh",
                      height: 420,
                      overflowY: "auto",
                      boxSizing: "border-box",
                      transition: "none",
                    },
                  }}
                  MenuListProps={{
                    sx: {
                      p: 0,
                      m: 0,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333" }}>
                    <span style={{ fontWeight: 600 }}>Notifications</span>
                    {unreadCount > 0 && (
                      <Button
                        size="small"
                        color="primary"
                        sx={{ fontSize: "0.85rem", textTransform: "none" }}
                        onClick={handleMarkAllAsRead}
                      >
                        Mark all as read
                      </Button>
                    )}
                  </Box>
                  <Box sx={{ maxHeight: 370, overflowY: "auto", p: 0, m: 0 }}>
                    {notificationLoading ? (
                      <MenuItem>Loading...</MenuItem>
                    ) : notifications.length === 0 ? (
                      <MenuItem>No notifications</MenuItem>
                    ) : (
                      notifications.map((noti, idx) => (
                        <MenuItem
                          key={noti.id || idx}
                          onClick={() => handleNotificationClick(noti)}
                          sx={{
                            whiteSpace: "normal",
                            fontSize: "0.95rem",
                            fontWeight: noti.isRead ? 400 : 700,
                            backgroundColor: noti.isRead ? "inherit" : "rgba(255, 103, 64, 0.12)",
                            color: noti.isRead ? "#bbb" : "#fff",
                            borderBottom: "1px solid #222",
                            display: "flex",
                            alignItems: "center",
                            minHeight: 56,
                            "&:hover": {
                              backgroundColor: "rgba(255, 103, 64, 0.18)",
                              color: "#ff6740",
                            },
                          }}
                        >
                          <Box sx={{ flexGrow: 1 }}>
                            {noti.message}
                            <span style={{ marginLeft: 8, fontSize: "0.8em", color: "#aaa" }}>
                              {noti.createdAt ? new Date(noti.createdAt).toLocaleString() : ""}
                            </span>
                          </Box>
                          {!noti.isRead && (
                            <span style={{
                              display: "inline-block",
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: "#ff6740",
                              marginLeft: 8,
                              flexShrink: 0,
                            }} />
                          )}
                        </MenuItem>
                      ))
                    )}
                  </Box>
                </Menu>

                {/* Account Icon */}
                <IconButton
                  onClick={handleAccountOpen}
                  sx={{
                    color: "#fff",
                    fontSize: "2rem", // Increased size
                    "&:hover": {
                      color: "#ff6740",
                    },
                  }}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={accountAnchorEl}
                  open={Boolean(accountAnchorEl)}
                  onClose={handleAccountClose}
                  PaperProps={{
                    style: {
                      backgroundColor: "#1a1a1a",
                      color: "#fff",
                      marginTop: "8px",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => handleAccountClick("editProfile")}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255, 103, 64, 0.1)",
                        color: "#ff6740",
                      },
                    }}
                  >
                    Edit Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleAccountClick("vipRegistration")}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255, 103, 64, 0.1)",
                        color: "#ff6740",
                      },
                    }}
                  >
                    VIP Registration
                  </MenuItem>
                  {authService.getCurrentUser()?.role === "ADMIN" && (
                    <MenuItem
                      onClick={() => handleAccountClick("adminDashboard")}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255, 103, 64, 0.1)",
                          color: "#ff6740",
                        },
                      }}
                    >
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => handleAccountClick("logout")}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255, 103, 64, 0.1)",
                        color: "#ff6740",
                      },
                    }}
                  >
                    Log Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
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
                  to="/register"
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
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  Fade,
} from "@mui/material";
import { AccountCircle, Lock, Comment, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("profile");
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+123456789",
    address: "123 Main Street, City, Country",
  });
  const [avatar, setAvatar] = useState("https://via.placeholder.com/100");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSaveChanges = () => {
    alert("User information updated successfully!");
    // Add save logic here
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
    // Add logout logic here
  };

  const handleAvatarChange = () => {
    const newAvatar = prompt("Enter the URL of your new avatar:");
    if (newAvatar) {
      setAvatar(newAvatar);
      alert("Avatar updated successfully!");
    }
  };

  const userComments = [
    "This is my first comment.",
    "I love this app!",
    "Looking forward to new features.",
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case "profile":
        return (
          <Fade in={true}>
            <Box>
              <Avatar
                sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                src={avatar}
                alt="User Avatar"
              />
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleAvatarChange}
                sx={{ display: "block", mx: "auto", mb: 2 }}
              >
                Edit Avatar
              </Button>
              <Typography variant="h5" gutterBottom>
                Edit Profile
              </Typography>
              <TextField
                label="Name"
                name="name"
                fullWidth
                margin="normal"
                value={userInfo.name}
                onChange={handleInputChange}
              />
              <TextField
                label="Email"
                name="email"
                fullWidth
                margin="normal"
                value={userInfo.email}
                onChange={handleInputChange}
              />
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                margin="normal"
                value={userInfo.phone}
                onChange={handleInputChange}
              />
              <TextField
                label="Address"
                name="address"
                fullWidth
                margin="normal"
                value={userInfo.address}
                onChange={handleInputChange}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </Box>
          </Fade>
        );
      case "password":
        return (
          <Fade in={true}>
            <Box>
              <Typography variant="h5" gutterBottom>
                Change Your Password
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => navigate("/change-password")}
              >
                Go to Change Password
              </Button>
            </Box>
          </Fade>
        );
      case "comments":
        return (
          <Fade in={true}>
            <Box>
              <Typography variant="h5" gutterBottom>
                My Comments
              </Typography>
              <List>
                {userComments.map((comment, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={comment} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Fade>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={2}>
        {/* Right Column */}
        <Grid item xs={12}>
          {renderContent()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;

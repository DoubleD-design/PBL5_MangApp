import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import { useUser } from "../context/UserContext";
import userService from "../services/userService";

const UserProfile = () => {
  const { user, loading, error, updateUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    vipStatus: user?.vipStatus || false,
    role: user?.role || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const updatedUser = await userService.editUserProfile({
        username: formData.username,
        email: formData.email
      }); // Only send username and email
      console.log("Profile updated:", updatedUser);
      updateUser(updatedUser); // Update context with new user data
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleEditAvatar = () => {
    // Add logic to edit avatar (e.g., file upload)
    console.log("Edit Avatar clicked");
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Grid container spacing={4}>
        {/* Avatar Section */}
        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
          <Avatar
            sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
            src="https://via.placeholder.com/120"
            alt="User Avatar"
          />
          <Button variant="outlined" onClick={handleEditAvatar}>
            Edit Avatar
          </Button>
        </Grid>

        {/* User Information Section */}
        <Grid item xs={12} md={8}>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!editMode}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editMode}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Vip"
              name="vipStatus"
              value={formData.vipStatus ? "Yes" : "No"}
              disabled
            />
            <TextField
              fullWidth
              margin="normal"
              label="Role"
              name="role"
              value={formData.role}
              disabled
            />
            <TextField
              fullWidth
              margin="normal"
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString()}
              disabled
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            {editMode ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;

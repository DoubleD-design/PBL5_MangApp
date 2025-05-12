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
    avatarUrl: user?.avatar || "",
    username: user?.username || "",
    email: user?.email || "",
    vipStatus: user?.vipStatus || false,
    role: user?.role || "",
    birthday: user?.birthday || "",
    gender: user?.gender || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setUploadingAvatar(true);

    try {
      const avatarUrl = await userService.updateAvatar(file);
      // Thêm timestamp để tạo URL duy nhất, tránh cache
      const updatedUser = {
        ...user,
        avatarUrl: `${avatarUrl}?t=${Date.now()}`,
      };
      updateUser(updatedUser); // Ensure the updated user object is saved in context
      setFormData((prev) => ({
        ...prev,
        avatarUrl: `${avatarUrl}?t=${Date.now()}`,
      }));
      setAvatarFile(null);
    } catch (error) {
      console.error("Error updating avatar:", error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedUser = await userService.editUserProfile({
        username: formData.username,
        email: formData.email,
        birthday: formData.birthday,
        gender: formData.gender,
      }); // Only send username, email, birthday, and gender
      console.log("Profile updated:", updatedUser);
      updateUser(updatedUser); // Update context with new user data
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
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
            src={
              user?.avatarUrl
                ? `${user.avatarUrl}?t=${user.updatedAt || Date.now()}`
                : "https://via.placeholder.com/120"
            }
            alt="User Avatar"
          />
          <Button
            variant="outlined"
            component="label"
            disabled={uploadingAvatar}
          >
            {uploadingAvatar ? <CircularProgress size={20} /> : "Edit Avatar"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleEditAvatar}
            />
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
              label="Birthday"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleInputChange}
              disabled={!editMode}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              fullWidth
              margin="normal"
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={!editMode}
              SelectProps={{
                native: true, // Use native select for consistent styling
              }}
              InputLabelProps={{ shrink: true }} // Ensure label stays above the field
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </TextField>
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

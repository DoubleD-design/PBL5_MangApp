import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  Divider,
} from "@mui/material";

const UserProfile = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = () => {
    if (password === confirmPassword) {
      alert("Password changed successfully!");
      setPassword("");
      setConfirmPassword("");
    } else {
      alert("Passwords do not match!");
    }
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
    // Add logout logic here
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Profile Section */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Avatar
          sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
          src="https://via.placeholder.com/100"
          alt="User Avatar"
        />
        <Typography variant="h5" gutterBottom>
          John Doe
        </Typography>
        <Typography variant="body1" color="text.secondary">
          johndoe@example.com
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Change Password Section */}
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>
      <TextField
        label="New Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handlePasswordChange}
      >
        Change Password
      </Button>

      <Divider sx={{ my: 3 }} />

      {/* Logout Section */}
      <Button
        variant="outlined"
        color="error"
        fullWidth
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Container>
  );
};

export default UserProfile;

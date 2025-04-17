import React, { useState } from "react";
import { Container, Typography, TextField, Button, Divider } from "@mui/material";
import userService from "../services/userService"; // Corrected import
import authService from "../services/authService"; // Import authService

const ChangePass = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordChange = async () => {
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await userService.changePassword({ oldPassword, password }); // Fixed payload key
      setSuccess("Password changed successfully!");
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");

      // Automatically log out and redirect to login page
      authService.logout();
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <TextField
        label="Old Password"
        type="password"
        fullWidth
        margin="normal"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
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
    </Container>
  );
};

export default ChangePass;

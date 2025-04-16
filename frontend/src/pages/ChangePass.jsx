import React, { useState } from "react";
import { Container, Typography, TextField, Button, Divider } from "@mui/material";

const ChangePass = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = () => {
    if (password === confirmPassword) {
      alert("Password changed successfully!");
      setOldPassword("");
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
      {/* Change Password Section */}
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>
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

export default ChangePass;

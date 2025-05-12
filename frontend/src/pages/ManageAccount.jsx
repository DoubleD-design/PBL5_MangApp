import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AccountCircle, Lock, Comment, Logout } from "@mui/icons-material";
import { useUser } from "../context/UserContext";
import UserProfile from "./UserProfile";
import ChangePass from "./ChangePass";
import MyComment from "./MyComment";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const ManageAccount = () => {
  const [selectedSection, setSelectedSection] = useState("profile");
  const { user, loading, error } = useUser();
  const navigate = useNavigate();

  const renderContent = () => {
    switch (selectedSection) {
      case "profile":
        return <UserProfile />;
      case "password":
        return <ChangePass />;
      case "comments":
        return <MyComment />;
      default:
        return (
          <Typography variant="body1">
            Select an option from the left to manage your account.
          </Typography>
        );
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Account
      </Typography>
      <Grid container spacing={2}>
        {/* Left Column */}
        <Grid item xs={4}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Avatar
              sx={{ width: 100, height: 100, mx: "auto", mb: 1 }}
              src={
                user?.avatarUrl
                  ? `${user.avatarUrl}?t=${user.updatedAt || Date.now()}`
                  : "https://via.placeholder.com/120"
              }
              alt="User Avatar"
            />
            <Typography variant="h6">{user.username}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Birthday: {new Date(user.birthday).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gender: {user.gender}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vip: {user.vipStatus ? "Yes" : "No"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {user.role}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <List>
            {[
              {
                section: "profile",
                label: "Your Profile",
                icon: <AccountCircle />,
              },
              {
                section: "password",
                label: "Change Your Password",
                icon: <Lock />,
              },
              {
                section: "comments",
                label: "Your Comments",
                icon: <Comment />,
              },
            ].map(({ section, label, icon }) => (
              <ListItem
                button
                key={section}
                onClick={() => setSelectedSection(section)}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItem>
            ))}
            <ListItem
              button
              onClick={() => {
                authService.logout();
                navigate("/login");
              }}
            >
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Grid>

        {/* Right Column */}
        <Grid item xs={8}>
          {renderContent()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManageAccount;

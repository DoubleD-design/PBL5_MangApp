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
} from "@mui/material";
import { AccountCircle, Lock, Comment, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import ChangePass from "./ChangePass";

const ManageAccount = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("profile");

  const handleLogout = () => {
    alert("Logged out successfully!");
    // Add logout logic here
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "profile":
        return <UserProfile />;
      case "password":
        return <ChangePass />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={2}>
        {/* Left Column */}
        <Grid item xs={4}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Avatar
              sx={{ width: 100, height: 100, mx: "auto", mb: 1 }}
              src="https://via.placeholder.com/100"
              alt="User Avatar"
            />
            <Typography variant="h6">John Doe</Typography>
            <Typography variant="body2" color="text.secondary">
              johndoe@example.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +123456789
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: 123 Main Street, City, Country
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <List>
            {[
              { section: "profile", label: "Your Profile", icon: <AccountCircle /> },
              { section: "password", label: "Change Your Password", icon: <Lock /> },
              { section: "comments", label: "Your Comments", icon: <Comment /> }, // Added "Your Comments"
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
            <ListItem button onClick={handleLogout}>
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

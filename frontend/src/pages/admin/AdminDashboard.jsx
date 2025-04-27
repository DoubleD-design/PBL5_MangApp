import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  useTheme,
} from "@mui/material";
import {
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import UserManagement from "./UserManagement";
import MangaManagement from "./MangaManagement";
import CommentManagement from "./CommentManagement";

const AdminDashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Admin Dashboard
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ width: "100%" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<PeopleIcon />} label="User Management" />
            <Tab icon={<MenuBookIcon />} label="Manga Management" />
            <Tab icon={<CommentIcon />} label="Comment Management" />
          </Tabs>
        </Box>

        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && <UserManagement />}
          {activeTab === 1 && <MangaManagement />}
          {activeTab === 2 && <CommentManagement />}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;

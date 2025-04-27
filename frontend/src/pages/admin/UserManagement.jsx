import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Lock,
  LockOpen,
  Block,
  CheckCircle,
  Star,
  StarBorder,
  Edit,
  Search,
} from "@mui/icons-material";
import authService from "../../services/authService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Replace with actual API call to get users
      const response = await authService.getAllUsers();
      setUsers(response);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user, type) => {
    setSelectedUser(user);
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = async () => {
    try {
      let message = "";
      let updatedUser = { ...selectedUser };

      switch (dialogType) {
        case "lock":
          // Replace with actual API call to lock user
          await authService.lockUser(selectedUser.id);
          updatedUser.locked = true;
          message = `User ${selectedUser.username} has been locked`;
          break;
        case "unlock":
          // Replace with actual API call to unlock user
          await authService.unlockUser(selectedUser.id);
          updatedUser.locked = false;
          message = `User ${selectedUser.username} has been unlocked`;
          break;
        case "ban":
          // Replace with actual API call to ban user
          await authService.banUser(selectedUser.id);
          updatedUser.banned = true;
          message = `User ${selectedUser.username} has been banned`;
          break;
        case "unban":
          // Replace with actual API call to unban user
          await authService.unbanUser(selectedUser.id);
          updatedUser.banned = false;
          message = `User ${selectedUser.username} has been unbanned`;
          break;
        case "vip":
          // Replace with actual API call to set VIP status
          await authService.setVipStatus(selectedUser.id, true);
          updatedUser.vipStatus = true;
          message = `User ${selectedUser.username} has been set as VIP`;
          break;
        case "removeVip":
          // Replace with actual API call to remove VIP status
          await authService.setVipStatus(selectedUser.id, false);
          updatedUser.vipStatus = false;
          message = `VIP status removed from ${selectedUser.username}`;
          break;
        default:
          break;
      }

      // Update the user in the local state
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );

      setSnackbar({
        open: true,
        message,
        severity: "success",
      });
    } catch (err) {
      console.error("Error performing action:", err);
      setSnackbar({
        open: true,
        message: `Error: ${err.message || "Failed to perform action"}`,
        severity: "error",
      });
    } finally {
      handleCloseDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">User Management</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />,
            }}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" color="primary" onClick={fetchUsers}>
            Refresh
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>VIP</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.banned ? (
                    <Chip label="Banned" color="error" size="small" />
                  ) : user.locked ? (
                    <Chip label="Locked" color="warning" size="small" />
                  ) : (
                    <Chip label="Active" color="success" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  {user.vipStatus ? (
                    <Chip
                      icon={<Star fontSize="small" />}
                      label="VIP"
                      color="primary"
                      size="small"
                    />
                  ) : (
                    <Chip
                      icon={<StarBorder fontSize="small" />}
                      label="Regular"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex" }}>
                    {user.locked ? (
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(user, "unlock")}
                        title="Unlock User"
                      >
                        <LockOpen fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="warning"
                        onClick={() => handleOpenDialog(user, "lock")}
                        title="Lock User"
                      >
                        <Lock fontSize="small" />
                      </IconButton>
                    )}

                    {user.banned ? (
                      <IconButton
                        color="success"
                        onClick={() => handleOpenDialog(user, "unban")}
                        title="Unban User"
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDialog(user, "ban")}
                        title="Ban User"
                      >
                        <Block fontSize="small" />
                      </IconButton>
                    )}

                    {user.vipStatus ? (
                      <IconButton
                        color="default"
                        onClick={() => handleOpenDialog(user, "removeVip")}
                        title="Remove VIP Status"
                      >
                        <StarBorder fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(user, "vip")}
                        title="Set as VIP"
                      >
                        <Star fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === "lock"
            ? "Lock User Account"
            : dialogType === "unlock"
            ? "Unlock User Account"
            : dialogType === "ban"
            ? "Ban User"
            : dialogType === "unban"
            ? "Unban User"
            : dialogType === "vip"
            ? "Set User as VIP"
            : "Remove VIP Status"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogType === "lock"
              ? `Are you sure you want to lock ${selectedUser?.username}'s account? They will not be able to log in until unlocked.`
              : dialogType === "unlock"
              ? `Are you sure you want to unlock ${selectedUser?.username}'s account?`
              : dialogType === "ban"
              ? `Are you sure you want to ban ${selectedUser?.username}? This will prevent them from accessing the platform.`
              : dialogType === "unban"
              ? `Are you sure you want to unban ${selectedUser?.username}?`
              : dialogType === "vip"
              ? `Are you sure you want to set ${selectedUser?.username} as a VIP user?`
              : `Are you sure you want to remove VIP status from ${selectedUser?.username}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAction} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;

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
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Delete, Visibility, Search, Refresh } from "@mui/icons-material";
import commentService from "../../services/commentService";
import mangaService from "../../services/mangaService";
import authService from "../../services/authService";
import userService from "../../services/userService";
import { format } from "date-fns";

const CommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewCommentDialog, setViewCommentDialog] = useState(false);
  const [mangaTitles, setMangaTitles] = useState({});
  const [userNames, setUserNames] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      // Replace with actual API call to get all comments
      const response = await commentService.getAllComments();
      setComments(response);

      // Fetch manga titles for each comment
      const mangaIds = [...new Set(response.map((comment) => comment.mangaId))];
      const titles = {};
      const userIds = [...new Set(response.map((comment) => comment.userId))];
      const usernames = {};

      for (const mangaId of mangaIds) {
        try {
          const manga = await mangaService.getMangaById(mangaId);
          titles[mangaId] = manga.title;
        } catch (err) {
          console.error(`Error fetching manga title for ID ${mangaId}:`, err);
          titles[mangaId] = `Manga #${mangaId}`;
        }
      }
      for (const userId of userIds) {
        try {
          const user = await userService.getUserById(userId);
          usernames[userId] = user.username;
        } catch (err) {
          console.error(`Error fetching user name for ID ${userId}:`, err);
          usernames[userId] = `User #${userId}`;
        }
      }

      setMangaTitles(titles);
      console.log("Manga titles:", titles);
      setUserNames(usernames);
      console.log("User names:", usernames);
      setError(null);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (comment, type) => {
    setSelectedComment(comment);
    setDialogType(type);

    if (type === "view") {
      setViewCommentDialog(true);
    } else {
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setViewCommentDialog(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredComments = comments.filter(
    (comment) =>
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mangaTitles[comment.mangaId] &&
        mangaTitles[comment.mangaId]
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  const handleAction = async () => {
    try {
      let message = "";

      switch (dialogType) {
        case "delete":
          // Replace with actual API call to delete comment
          await commentService.deleteComment(selectedComment.id);
          setComments(
            comments.filter((comment) => comment.id !== selectedComment.id)
          );
          message = `Comment has been deleted`;
          break;

        default:
          break;
      }

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
        <Typography variant="h5">Comment Management</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search comments..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />,
            }}
            sx={{ mr: 2 }}
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchComments}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Manga</TableCell>
              <TableCell>Content Preview</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredComments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell>{comment.id}</TableCell>
                <TableCell>
                  {userNames[comment.userId] || `User #${comment.userId}`}
                </TableCell>
                <TableCell>
                  {mangaTitles[comment.mangaId] || `Manga #${comment.mangaId}`}
                </TableCell>
                <TableCell>
                  {comment.content.length > 50
                    ? `${comment.content.substring(0, 50)}...`
                    : comment.content}
                </TableCell>
                <TableCell>{formatDate(comment.createdAt)}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex" }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(comment, "view")}
                      title="View Comment"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleOpenDialog(comment, "delete")}
                      title="Delete Comment"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Comment Dialog */}
      <Dialog
        open={viewCommentDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>View Comment</DialogTitle>
        <DialogContent>
          {selectedComment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>User:</strong>{" "}
                {selectedComment.username || `User #${selectedComment.userId}`}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Manga:</strong>{" "}
                {mangaTitles[selectedComment.mangaId] ||
                  `Manga #${selectedComment.mangaId}`}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Posted on:</strong>{" "}
                {formatDate(selectedComment.createdAt)}
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Typography variant="body1">
                  {selectedComment.content}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === "delete" ? "Delete Comment" : ""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogType === "delete"
              ? "Are you sure you want to delete this comment? This action cannot be undone."
              : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            color={
              dialogType === "delete"
                ? "error"
                : dialogType === "approve"
                ? "success"
                : ""
            }
            variant="contained"
          >
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

export default CommentManagement;

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { useUser } from "../context/UserContext";
import commentService from "../services/commentService";
import { format } from "date-fns";

const MyComment = () => {
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await commentService.getCurrentUserComments();
        setComments(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load your comments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleEditClick = (comment) => {
    setCurrentComment(comment);
    setEditedContent(comment.content);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (comment) => {
    setCurrentComment(comment);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editedContent.trim()) return;

    try {
      setActionLoading(true);
      const updatedComment = await commentService.updateComment(
        currentComment.id,
        { ...currentComment, content: editedContent }
      );

      // Update the comments list with the edited comment
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );

      setActionSuccess("Comment updated successfully!");
      setTimeout(() => setActionSuccess(null), 3000);
      setEditDialogOpen(false);
    } catch (err) {
      setError("Failed to update comment. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      setActionLoading(true);
      await commentService.deleteComment(currentComment.id);

      // Remove the deleted comment from the list
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== currentComment.id)
      );

      setActionSuccess("Comment deleted successfully!");
      setTimeout(() => setActionSuccess(null), 3000);
      setDeleteDialogOpen(false);
    } catch (err) {
      setError("Failed to delete comment. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/account" color="inherit">
          Account
        </MuiLink>
        <Typography color="text.primary">My Comments</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Your Comments
      </Typography>

      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {actionSuccess}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : comments.length > 0 ? (
        <Grid container spacing={3}>
          {comments.map((comment) => (
            <Grid item xs={12} key={comment.id}>
              <Card
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "box-shadow 0.3s",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" color="primary">
                      {comment.manga?.title || "Unknown Manga"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(comment.createdAt)}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {comment.content}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditClick(comment)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(comment)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't made any comments yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your comments on manga will appear here
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Browse Manga
          </Button>
        </Box>
      )}

      {/* Edit Comment Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            disabled={actionLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            disabled={!editedContent.trim() || actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Comment Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this comment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSubmit}
            color="error"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyComment;

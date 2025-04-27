import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ThumbUp,
  ThumbUpOutlined,
  Edit,
  Delete,
  Send,
} from "@mui/icons-material";
import { format } from "date-fns";
import commentService from "../services/commentService";
import authService from "../services/authService";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ mangaId }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await commentService.getCommentsByMangaId(mangaId);
        setComments(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching comments:", err);
        // Don't show error to user if it's an authentication error
        if (err.response && err.response.status === 401) {
          setComments([]);
        } else {
          setError("Failed to load comments. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [mangaId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate("/login", { state: { from: `/manga/${mangaId}` } });
      return;
    }

    try {
      setSubmitting(true);

      // Ensure user and user.id are valid before proceeding
      if (!user || typeof user.id !== "number") {
        setError("User information is missing. Please log in again.");
        setSubmitting(false);
        return;
      }

      const commentData = {
        userId: user.id, // Now we know user.id is a number
        mangaId: parseInt(mangaId),
        content: newComment,
        // createdAt is usually set by the backend
      };

      const createdComment = await commentService.createComment(commentData);

      // Add the new comment to the list
      setComments([createdComment, ...comments]);
      setNewComment("");
      setSuccess("Comment posted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post comment. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

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
      setSubmitting(true);

      if (!user || typeof user.id !== "number") {
        setError("User information is missing. Please log in again.");
        setSubmitting(false);
        return;
      }

      const commentData = {
        commentId: currentComment.id,
        content: editedContent,
      };

      // Đặt console.log ngay đây để xem dữ liệu trước khi gửi
      console.log("Sending update:", JSON.stringify(commentData));

      const updatedComment = await commentService.updateComment(
        currentComment.id,
        { ...currentComment, content: editedContent }
      );

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );

      setSuccess("Comment updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      setEditDialogOpen(false);
    } catch (err) {
      setError("Failed to update comment. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      setSubmitting(true);
      await commentService.deleteComment(currentComment.id);

      // Remove the deleted comment from the list
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== currentComment.id)
      );

      setSuccess("Comment deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
      setDeleteDialogOpen(false);
    } catch (err) {
      setError("Failed to delete comment. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSubmitting(false);
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

  const isCommentOwner = (comment) => {
    return user && comment.userId === user.id;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Comments
      </Typography>

      {/* Comment Form */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <form onSubmit={handleCommentSubmit}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder={
                authService.isAuthenticated()
                  ? "Write a comment..."
                  : "Please log in to comment"
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!authService.isAuthenticated() || submitting}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  !newComment.trim() ||
                  submitting ||
                  !authService.isAuthenticated()
                }
                endIcon={submitting ? <CircularProgress size={20} /> : <Send />}
              >
                Post Comment
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Success and Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Comments List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={40} />
        </Box>
      ) : comments.length > 0 ? (
        <Box>
          {comments.map((comment) => (
            <Card
              key={comment.id}
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: 2,
                transition: "box-shadow 0.3s",
                "&:hover": {
                  boxShadow: 4,
                },
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    src={comment.user?.avatar || ""}
                    alt={comment.user?.username || "User"}
                  >
                    {(comment.user?.username || "U")[0]}
                  </Avatar>
                }
                title={comment.username ? comment.username : "Anonymous"}
                subheader={formatDate(comment.createdAt)}
                action={
                  isCommentOwner(comment) && (
                    <Box>
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
                  )
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="body1">{comment.content}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            py: 4,
            textAlign: "center",
            backgroundColor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No comments yet. Be the first to comment!
          </Typography>
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
            disabled={submitting}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialogOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            disabled={!editedContent.trim() || submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Save"}
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
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSubmit}
            color="error"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommentSection;

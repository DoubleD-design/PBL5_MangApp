import api from "./api";

const commentService = {
  // Get all comments for a manga
  getCommentsByMangaId: async (mangaId) => {
    try {
      const response = await api.get(`/comments/manga/${mangaId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  // Get all comments by a user
  getCommentsByUserId: async (userId) => {
    try {
      const response = await api.get(`/comments/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user comments:", error);
      throw error;
    }
  },

  // Create a new comment
  createComment: async (commentData) => {
    try {
      // Rely on default Axios instance headers for Content-Type
      const response = await api.post("/comments", commentData);
      console.log("Comment created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  // Update an existing comment
  updateComment: async (commentId, commentData) => {
    try {
      // Rely on default Axios instance headers for Content-Type
      const response = await api.put(`/comments/${commentId}`, commentData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },

  // Get current user's comments
  getCurrentUserComments: async () => {
    try {
      const response = await api.get("/comments/user/current");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user comments:", error);
      throw error;
    }
  },

  getAllComments: async () => {
    try {
      const response = await api.get("/comments");
      return response.data;
    } catch (error) {
      console.error("Error fetching all comments:", error);
      throw error;
    }
  },
};

export default commentService;

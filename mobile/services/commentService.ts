import api from './api';

export interface Comment {
  id: number;
  userId: number;
  username: string;
  mangaId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  // Thêm các trường khác nếu cần
  [key: string]: any;
}

export interface CreateCommentData {
  mangaId: number;
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

const commentService = {
  getCommentsByMangaId: async (mangaId: number): Promise<Comment[]> => {
    try {
      const response = await api.get(`/comments/manga/${mangaId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  getCommentsByUserId: async (userId: number): Promise<Comment[]> => {
    try {
      const response = await api.get(`/comments/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user comments:', error);
      throw error;
    }
  },

  createComment: async (commentData: CreateCommentData): Promise<Comment> => {
    try {
      const response = await api.post('/comments', commentData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },


  updateComment: async (
    commentId: number,
    commentData: UpdateCommentData
  ): Promise<Comment> => {
    try {
      const response = await api.put(`/comments/${commentId}`, commentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  deleteComment: async (commentId: number): Promise<boolean> => {
    try {
      await api.delete(`/comments/${commentId}`);
      return true;
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  getCurrentUserComments: async (): Promise<Comment[]> => {
    try {
      const response = await api.get('/comments/user/current');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching current user comments:', error);
      throw error;
    }
  },

  getAllComments: async (): Promise<Comment[]> => {
    try {
      const response = await api.get('/comments');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all comments:', error);
      throw error;
    }
  },
};

export default commentService;

import api from './api';

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/category');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/category/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default categoryService;
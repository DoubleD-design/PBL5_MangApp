import api from "./api";

interface Category {
  id: number;
  name: string;
  // Thêm các trường khác nếu cần
  [key: string]: any;
}

const categoryService = {
  // Lấy tất cả danh mục
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get("/categories");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Lấy danh mục theo ID
  getCategoryById: async (id: number): Promise<Category> => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};

export default categoryService;

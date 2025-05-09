import api from "./api";

// Lấy thông tin manga theo ID
const getMangaById = async (mangaId) => {
  const res = await api.get(`/manga/${mangaId}`);
  return res.data;
};

// Lấy danh sách chương của manga
const getChaptersByManga = async (mangaId) => {
  const res = await api.get(`/chapters/manga/${mangaId}`);
  return res.data;
};

// Tạo chương mới (multipart/form-data)
const createChapter = async (mangaId, formData, imageFiles) => {
  const form = new FormData();
  form.append("title", formData.title);
  imageFiles.forEach((file) => form.append("images", file));
  // Gửi lên endpoint backend nhận multipart/form-data cho chương mới
  const res = await api.post(`/chapters?mangaId=${mangaId}`, form);
  return res.data;
};

// Cập nhật chương (multipart/form-data)
const updateChapter = async (mangaId, chapterId, formData, imageFiles) => {
  const form = new FormData();
  form.append("title", formData.title);
  imageFiles.forEach((file) => form.append("images", file));
  const res = await api.put(`/chapters/${chapterId}?mangaId=${mangaId}`, form);
  return res.data;
};

// Xóa chương
const deleteChapter = async (mangaId, chapterId) => {
  const res = await api.delete(`/manga/${mangaId}/chapters/${chapterId}`);
  return res.data;
};

const chapterService = {
  getMangaById,
  getChaptersByManga,
  createChapter,
  updateChapter,
  deleteChapter,
};

export default chapterService;

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
const createChapter = async (formData, files) => {
  const form = new FormData();
  form.append("dataForm", JSON.stringify(formData));
  files.forEach((file) => form.append("files", file));

  const res = await api.post(`/chapters/create`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Cập nhật chương (multipart/form-data)
const updateChapter = async (chapterId, formData, files) => {
  const form = new FormData();
  form.append("dataForm", JSON.stringify(formData));
  files.forEach((file) => form.append("files", file));

  const res = await api.put(`/chapters/${chapterId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Xóa chương
const deleteChapter = async (chapterId) => {
  // Ensure the API call is made to the correct endpoint
  const res = await api.delete(`/chapters/${chapterId}`);
  return res.data;
};

// Lấy danh sách trang của chương
const getPagesByChapterId = async (chapterId) => {
  const res = await api.get(`/pages/chapter/${chapterId}`);
  return res.data;
};

// Xóa trang
const deletePage = async (pageId) => {
  const res = await api.delete(`/pages/${pageId}`);
  return res.data;
};

const chapterService = {
  getMangaById,
  getChaptersByManga,
  createChapter,
  updateChapter,
  deleteChapter,
  getPagesByChapterId,
  deletePage,
};

export default chapterService;

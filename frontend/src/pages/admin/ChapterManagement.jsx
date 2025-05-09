import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, IconButton, CircularProgress, Typography, Box, Tooltip, Chip, Stack
} from "@mui/material";
import { Add, Edit, Delete, ArrowBack, Image as ImageIcon } from "@mui/icons-material";
import chapterService from "../../services/chapterService";

const ChapterManagement = () => {
  const { mangaId } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(""); // "add" | "edit"
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, chapter: null });

  // Fetch manga info and chapters
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mangaData = await chapterService.getMangaById(mangaId);
        setManga(mangaData);

        const chaptersData = await chapterService.getChaptersByManga(mangaId);
        setChapters(chaptersData);
      } catch (err) {
        setSnackbar({ open: true, message: "Lỗi tải dữ liệu!", severity: "error" });
      }
      setLoading(false);
    };
    fetchData();
  }, [mangaId]);

  // Handlers
  const handleOpenDialog = (type, chapter = null) => {
    setDialogType(type);
    setSelectedChapter(chapter);
    if (type === "edit" && chapter) {
      setFormData({
        title: chapter.title,
        images: [],
      });
      setImageFiles([]);
    } else {
      setFormData({ title: "", images: [] });
      setImageFiles([]);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedChapter(null);
    setFormData({ title: "", images: [] });
    setImageFiles([]);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    try {
      if (dialogType === "add") {
        await chapterService.createChapter(mangaId, formData, imageFiles);
      } else if (dialogType === "edit" && selectedChapter) {
        await chapterService.updateChapter(mangaId, selectedChapter.id, formData, imageFiles);
      }
      setSnackbar({ open: true, message: "Lưu chương thành công!", severity: "success" });
      handleCloseDialog();
      // Reload chapters
      const chaptersData = await chapterService.getChaptersByManga(mangaId);
      setChapters(chaptersData);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await chapterService.deleteChapter(mangaId, deleteDialog.chapter.id);
      setSnackbar({ open: true, message: "Xóa chương thành công!", severity: "success" });
      setDeleteDialog({ open: false, chapter: null });
      // Reload chapters
      const chaptersData = await chapterService.getChaptersByManga(mangaId);
      setChapters(chaptersData);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/admin")}
        sx={{ mb: 2 }}
        variant="outlined"
      >
        Quay lại danh sách Manga
      </Button>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          color: "#ff6740", // Cam nổi bật như theme
          letterSpacing: 1,
        }}
      >
        Quản lý chương: <span style={{ color: "#fff" }}>{manga?.title}</span>
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpenDialog("add")}
        sx={{ mb: 2, fontWeight: 600, letterSpacing: 1 }}
      >
        Thêm chương mới
      </Button>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          background: "background.paper",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: (theme) => theme.palette.background.paper,
                borderBottom: "2px solid #ff6740",
              }}
            >
              <TableCell align="center" width={60} sx={{ color: "#ff6740", fontWeight: 700 }}>
                Số chương
              </TableCell>
              <TableCell align="center" sx={{ color: "#ff6740", fontWeight: 700 }}>
                Tiêu đề
              </TableCell>
              <TableCell align="center" width={120} sx={{ color: "#ff6740", fontWeight: 700 }}>
                Ngày tạo
              </TableCell>
              <TableCell align="center" width={100} sx={{ color: "#ff6740", fontWeight: 700 }}>
                Số ảnh
              </TableCell>
              <TableCell align="center" width={120} sx={{ color: "#ff6740", fontWeight: 700 }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chapters.map((chapter, idx) => (
              <TableRow
                key={chapter.id}
                hover
                sx={{
                  backgroundColor: idx % 2 === 0 ? "background.default" : "background.paper",
                  "&:hover": {
                    backgroundColor: "#2c2320",
                  },
                }}
              >
                <TableCell align="center" sx={{ color: "#fff" }}>{idx}</TableCell>
                <TableCell>
                  <Typography fontWeight={600} sx={{ color: "#fff" }}>{chapter.title}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ color: "#fff" }}>
                  {new Date(chapter.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Số lượng ảnh">
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                      <ImageIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ color: "#fff" }}>
                        {chapter.pages?.length || 0}
                      </Typography>
                    </Stack>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Sửa chương">
                    <IconButton color="primary" onClick={() => handleOpenDialog("edit", chapter)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa chương">
                    <IconButton color="error" onClick={() => setDeleteDialog({ open: true, chapter })}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {chapters.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">Chưa có chương nào.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            color: "#ff6740",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          {dialogType === "add" ? "Thêm chương mới" : "Sửa chương"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tiêu đề"
            name="title"
            fullWidth
            value={formData.title}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ mb: 2, color: "#ff6740", borderColor: "#ff6740" }}
          >
            Chọn ảnh chương
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {imageFiles.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: "#ff6740" }}>
                Ảnh đã chọn:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {imageFiles.map((file, idx) => (
                  <Box key={idx} sx={{ width: 60, height: 80, border: "1px solid #eee", borderRadius: 1, overflow: "hidden", position: "relative" }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ background: "#ff6740" }}>
            {dialogType === "add" ? "Thêm" : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, chapter: null })}>
        <DialogTitle sx={{ color: "#ff6740", fontWeight: 700 }}>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa chương này không?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, chapter: null })}>Hủy</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Xóa</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default ChapterManagement;
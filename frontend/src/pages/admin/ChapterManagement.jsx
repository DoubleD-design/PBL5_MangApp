import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, IconButton, CircularProgress, Typography, Box, Tooltip, Chip, Stack
} from "@mui/material";
import { Add, Edit, Delete, ArrowBack, Image as ImageIcon, AddCircle, Delete as DeleteIcon } from "@mui/icons-material";
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
  const [viewDialog, setViewDialog] = useState({ open: false, pages: [] });

  // Fetch manga info and chapters
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mangaData = await chapterService.getMangaById(mangaId);
        setManga(mangaData);

        const chaptersData = await chapterService.getChaptersByManga(mangaId);

        // Fetch pages for each chapter and include them in the chapters data
        const chaptersWithPages = await Promise.all(
          chaptersData.map(async (chapter) => {
            const pages = await chapterService.getPagesByChapterId(chapter.id);
            return { ...chapter, pages };
          })
        );

        setChapters(chaptersWithPages);
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
        chapterNumber: chapter.chapterNumber,
        images: [],
      });
      setImageFiles([]);
    } else {
      // Calculate the next chapter number
      const nextChapterNumber = chapters.length > 0 
        ? Math.max(...chapters.map((c) => c.chapterNumber)) + 1 
        : 1;
      setFormData({ title: "", chapterNumber: nextChapterNumber, images: [] });
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
      const formDataToSend = {
        manga_id: mangaId,
        chapter_number: formData.chapterNumber,
        title: formData.title,
      };
  
      if (dialogType === "add") {
        await chapterService.createChapter(formDataToSend, imageFiles);
      } else if (dialogType === "edit" && selectedChapter) {
        await chapterService.updateChapter(selectedChapter.id, formDataToSend, imageFiles);
      }
  
      setSnackbar({ open: true, message: "Lưu chương thành công!", severity: "success" });
      handleCloseDialog();
  
      // Reload chapters with pages data
      const chaptersData = await chapterService.getChaptersByManga(mangaId);
      
      // Fetch pages for each chapter
      const chaptersWithPages = await Promise.all(
        chaptersData.map(async (chapter) => {
          const pages = await chapterService.getPagesByChapterId(chapter.id);
          return { ...chapter, pages };
        })
      );
  
      setChapters(chaptersWithPages);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      // Call the API to delete the chapter
      await chapterService.deleteChapter(deleteDialog.chapter.id);

      // Show success notification
      setSnackbar({ open: true, message: "Xóa chương thành công!", severity: "success" });

      // Remove the deleted chapter from the UI
      setChapters((prevChapters) =>
        prevChapters.filter((chapter) => chapter.id !== deleteDialog.chapter.id)
      );

      // Close the delete dialog
      setDeleteDialog({ open: false, chapter: null });
    } catch (err) {
      // Show error notification
      setSnackbar({ open: true, message: "Lỗi xóa chương!", severity: "error" });
    }
  };

  const handleViewChapter = async (chapterId) => {
    try {
      const pages = await chapterService.getPagesByChapterId(chapterId);
      setViewDialog({ open: true, pages });
    } catch (err) {
      setSnackbar({ open: true, message: "Lỗi tải ảnh chương!", severity: "error" });
    }
  };

  const handleCloseViewDialog = () => {
    setViewDialog({ open: false, pages: [] });
  };

  const handleAddPage = async (chapterId) => {
    try {
      // Logic to add a new page (e.g., open a file picker and upload the image)
      setSnackbar({ open: true, message: "Chức năng thêm trang chưa được triển khai!", severity: "info" });

      // Example: After adding a page, update the chapter's page count
      const updatedPages = await chapterService.getPagesByChapterId(chapterId);
      setViewDialog({ ...viewDialog, pages: updatedPages });

      // Update the chapter's page count in the main list
      setChapters((prevChapters) =>
        prevChapters.map((chapter) =>
          chapter.id === chapterId ? { ...chapter, pages: updatedPages } : chapter
        )
      );
    } catch (err) {
      setSnackbar({ open: true, message: "Lỗi thêm trang!", severity: "error" });
    }
  };

  const handleDeletePage = async (pageId) => {
    try {
      await chapterService.deletePage(pageId);
      setSnackbar({ open: true, message: "Xóa trang thành công!", severity: "success" });

      // Reload pages for the current chapter
      const updatedPages = await chapterService.getPagesByChapterId(viewDialog.pages[0]?.chapterId);
      setViewDialog({ ...viewDialog, pages: updatedPages });

      // Update the chapter's page count in the main list
      setChapters((prevChapters) =>
        prevChapters.map((chapter) =>
          chapter.id === viewDialog.pages[0]?.chapterId ? { ...chapter, pages: updatedPages } : chapter
        )
      );
    } catch (err) {
      setSnackbar({ open: true, message: "Lỗi xóa trang!", severity: "error" });
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
        Return
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
        Chapter Management: <span style={{ color: "#fff" }}>{manga?.title}</span>
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpenDialog("add")}
        sx={{ mb: 2, fontWeight: 600, letterSpacing: 1 }}
      >
        Add new chapter
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
                Chapter No.
              </TableCell>
              <TableCell align="center" sx={{ color: "#ff6740", fontWeight: 700 }}>
                Title
              </TableCell>
              <TableCell align="center" width={120} sx={{ color: "#ff6740", fontWeight: 700 }}>
                Created At
              </TableCell>
              <TableCell align="center" width={100} sx={{ color: "#ff6740", fontWeight: 700 }}>
                Pages
              </TableCell>
              <TableCell align="center" width={120} sx={{ color: "#ff6740", fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chapters.map((chapter, idx) => (
              <TableRow
                key={chapter.id}
                hover
                onClick={() => handleViewChapter(chapter.id)}
                sx={{
                  backgroundColor: idx % 2 === 0 ? "background.default" : "background.paper",
                  "&:hover": {
                    backgroundColor: "#2c2320",
                    cursor: "pointer",
                  },
                }}
              >
                <TableCell align="center" sx={{ color: "#fff" }}>
                  {chapter.chapterNumber}
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} sx={{ color: "#fff" }}>{chapter.title}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ color: "#fff" }}>
                  {new Date(chapter.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Number of images">
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                      <ImageIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ color: "#fff" }}>
                        {chapter.pages?.length || 0}
                      </Typography>
                    </Stack>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit chapter">
                    <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleOpenDialog("edit", chapter); }}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete chapter">
                    <IconButton color="error" onClick={(e) => { e.stopPropagation(); setDeleteDialog({ open: true, chapter }); }}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {chapters.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">No chapters yet.</Typography>
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
          {dialogType === "add" ? "Add New Chapter" : "Edit Chapter"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
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
            Choose chapter images
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
                Selected images:
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
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ background: "#ff6740" }}>
            {dialogType === "add" ? "Add" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, chapter: null })}>
        <DialogTitle sx={{ color: "#ff6740", fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this chapter?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, chapter: null })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog.open} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            color: "#ff6740",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          View Chapter Images
        </DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
            {viewDialog.pages.map((page, idx) => (
              <React.Fragment key={idx}>
                <Box sx={{ width: 120, textAlign: "center" }}>
                  <Box
                    sx={{
                      width: "100%",
                      height: 160,
                      border: "1px solid #eee",
                      borderRadius: 1,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={page.imageUrl}
                      alt={`Page ${page.pageNumber}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                  <IconButton
                    size="small"
                    color="error"
                    sx={{ mt: 1 }}
                    onClick={() => handleDeletePage(page.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                {idx < viewDialog.pages.length - 1 && (
                  <IconButton
                    size="large"
                    color="primary"
                    onClick={() => handleAddPage(viewDialog.pages[0]?.chapterId)}
                  >
                    <AddCircle />
                  </IconButton>
                )}
              </React.Fragment>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      >
      </Snackbar>
    </Box>
  );
};

export default ChapterManagement;
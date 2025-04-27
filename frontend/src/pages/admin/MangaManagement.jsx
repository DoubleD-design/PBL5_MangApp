import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Search,
  Refresh,
} from "@mui/icons-material";
import mangaService from "../../services/mangaService";
import categoryService from "../../services/categoryService";

const MangaManagement = () => {
  const [mangas, setMangas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedManga, setSelectedManga] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    coverImage: "",
    status: "ONGOING",
    categoryIds: [],
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchMangas();
    fetchCategories();
  }, []);

  const fetchMangas = async () => {
    try {
      setLoading(true);
      // Replace with actual API call to get mangas
      const response = await mangaService.getAllMangas(0, 100);
      setMangas(response.content || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching mangas:", err);
      setError("Failed to load mangas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleOpenDialog = (manga, type) => {
    setDialogType(type);

    if (type === "add") {
      setFormData({
        title: "",
        author: "",
        description: "",
        coverImage: "",
        status: "ONGOING",
        categoryIds: [],
      });
    } else if (type === "edit" && manga) {
      setSelectedManga(manga);
      setFormData({
        title: manga.title,
        author: manga.author,
        description: manga.description,
        coverImage: manga.coverImage,
        status: manga.status,
        categoryIds: manga.categories?.map((cat) => cat.id) || [],
      });
    } else {
      setSelectedManga(manga);
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      categoryIds: e.target.value,
    });
  };

  const filteredMangas = mangas.filter(
    (manga) =>
      manga.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manga.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = async () => {
    try {
      let message = "";
      let updatedManga = null;

      switch (dialogType) {
        case "add":
          // Replace with actual API call to add manga
          const newManga = await mangaService.createManga(formData);
          setMangas([...mangas, newManga]);
          message = `Manga "${formData.title}" has been added`;
          break;

        case "edit":
          // Replace with actual API call to update manga
          updatedManga = await mangaService.updateManga(
            selectedManga.id,
            formData
          );
          setMangas(
            mangas.map((manga) =>
              manga.id === updatedManga.id ? updatedManga : manga
            )
          );
          message = `Manga "${updatedManga.title}" has been updated`;
          break;

        case "delete":
          // Replace with actual API call to delete manga
          await mangaService.deleteManga(selectedManga.id);
          setMangas(mangas.filter((manga) => manga.id !== selectedManga.id));
          message = `Manga "${selectedManga.title}" has been deleted`;
          break;

        case "toggleVisibility":
          // Replace with actual API call to toggle visibility
          const newVisibility = !selectedManga.visible;
          updatedManga = await mangaService.updateMangaVisibility(
            selectedManga.id,
            newVisibility
          );
          setMangas(
            mangas.map((manga) =>
              manga.id === updatedManga.id ? updatedManga : manga
            )
          );
          message = `Manga "${updatedManga.title}" is now ${
            newVisibility ? "visible" : "hidden"
          }`;
          break;

        default:
          break;
      }

      setSnackbar({
        open: true,
        message,
        severity: "success",
      });
    } catch (err) {
      console.error("Error performing action:", err);
      setSnackbar({
        open: true,
        message: `Error: ${err.message || "Failed to perform action"}`,
        severity: "error",
      });
    } finally {
      handleCloseDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">Manga Management</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search mangas..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />,
            }}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenDialog(null, "add")}
            sx={{ mr: 2 }}
          >
            Add Manga
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchMangas}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Visibility</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMangas.map((manga) => (
              <TableRow key={manga.id}>
                <TableCell>{manga.id}</TableCell>
                <TableCell>{manga.title}</TableCell>
                <TableCell>{manga.author}</TableCell>
                <TableCell>
                  <Chip
                    label={manga.status}
                    color={manga.status === "COMPLETED" ? "success" : "primary"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {manga.categories?.map((category) => (
                      <Chip
                        key={category.id}
                        label={category.name}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  {manga.visible ? (
                    <Chip label="Visible" color="success" size="small" />
                  ) : (
                    <Chip label="Hidden" color="default" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex" }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(manga, "edit")}
                      title="Edit Manga"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDialog(manga, "delete")}
                      title="Delete Manga"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    <IconButton
                      color={manga.visible ? "default" : "primary"}
                      onClick={() =>
                        handleOpenDialog(manga, "toggleVisibility")
                      }
                      title={manga.visible ? "Hide Manga" : "Show Manga"}
                    >
                      {manga.visible ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog && (dialogType === "add" || dialogType === "edit")}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogType === "add" ? "Add New Manga" : "Edit Manga"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cover Image URL"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="ONGOING">Ongoing</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="HIATUS">Hiatus</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  name="categoryIds"
                  value={formData.categoryIds}
                  onChange={handleCategoryChange}
                  label="Categories"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const category = categories.find(
                          (cat) => cat.id === value
                        );
                        return (
                          <Chip
                            key={value}
                            label={category ? category.name : value}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAction} color="primary" variant="contained">
            {dialogType === "add" ? "Add" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={
          openDialog &&
          (dialogType === "delete" || dialogType === "toggleVisibility")
        }
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          {dialogType === "delete"
            ? "Delete Manga"
            : selectedManga?.visible
            ? "Hide Manga"
            : "Show Manga"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogType === "delete"
              ? `Are you sure you want to delete "${selectedManga?.title}"? This action cannot be undone.`
              : selectedManga?.visible
              ? `Are you sure you want to hide "${selectedManga?.title}"? It will no longer be visible to users.`
              : `Are you sure you want to make "${selectedManga?.title}" visible to users?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            color={dialogType === "delete" ? "error" : "primary"}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MangaManagement;

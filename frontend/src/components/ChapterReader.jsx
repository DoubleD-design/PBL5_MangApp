import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import readingHistoryService from "../services/readingHistoryService";
import {
  Container,
  Box,
  IconButton,
  Paper,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Slider,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
  ZoomIn,
  ZoomOut,
  Home,
} from "@mui/icons-material";
import api from "../services/api";

const ChapterReader = () => {
  const { mangaId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(100);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chapter, setChapter] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [nextChapter, setNextChapter] = useState(null);
  const [prevChapter, setPrevChapter] = useState(null);

  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Fetch chapter data
  useEffect(() => {
    const fetchChapterData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch the current chapter
        const chapterUrl = `/chapters/manga/${mangaId}/chapter/${chapterNumber}`;
        console.log("Requesting chapter URL:", chapterUrl); // Log URL
        const chapterResponse = await api.get(chapterUrl);
        setChapter(chapterResponse.data);

        // Add to reading history when chapter is loaded
        if (chapterResponse.data && chapterResponse.data.id) {
          // Track the current page as the last read page (default to 1 for new chapters)
          const lastReadPage = 1;
          await readingHistoryService.addToReadingHistory(
            mangaId,
            chapterResponse.data.id,
            parseInt(chapterNumber),
            lastReadPage
          );

          // We could also update the last read page when the user scrolls through pages
          // This would require tracking the current visible page and updating the history
        }

        // Fetch chapter pages
        const pagesUrl = `/chapters/manga/${mangaId}/chapter/${chapterNumber}/pages`;
        console.log("Requesting pages URL:", pagesUrl); // Log URL
        const pagesResponse = await api.get(pagesUrl);
        setPages(pagesResponse.data);

        // Fetch all chapters for this manga for navigation
        const allChaptersUrl = `/chapters/manga/${mangaId}`;
        console.log("Requesting all chapters URL:", allChaptersUrl); // Log URL
        const chaptersResponse = await api.get(allChaptersUrl);
        setAllChapters(chaptersResponse.data);

        // Determine next and previous chapters
        const sortedChapters = [...chaptersResponse.data].sort(
          (a, b) => a.chapterNumber - b.chapterNumber
        );
        const currentIndex = sortedChapters.findIndex(
          (ch) => ch.chapterNumber === parseInt(chapterNumber)
        );

        if (currentIndex < sortedChapters.length - 1) {
          setNextChapter(sortedChapters[currentIndex + 1]);
        }

        if (currentIndex > 0) {
          setPrevChapter(sortedChapters[currentIndex - 1]);
        }
      } catch (err) {
        console.error("Error fetching chapter data:", err);
        setError("Failed to load chapter. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapterData();
  }, [mangaId, chapterNumber]);

  // Navigate to next chapter
  const goToNextChapter = () => {
    if (nextChapter) {
      navigate(`/manga/${mangaId}/chapter/${nextChapter.chapterNumber}`);
    }
  };

  // Navigate to previous chapter
  const goToPrevChapter = () => {
    if (prevChapter) {
      navigate(`/manga/${mangaId}/chapter/${prevChapter.chapterNumber}`);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* Top Bar */}
      <Paper elevation={2} sx={{ py: 1, px: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <IconButton
            onClick={goToPrevChapter}
            disabled={!prevChapter}
            sx={{ visibility: prevChapter ? "visible" : "hidden" }}
          >
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {chapter ? chapter.title : `Chapter ${chapterNumber}`}
          </Typography>
          <IconButton
            onClick={goToNextChapter}
            disabled={!nextChapter}
            sx={{ visibility: nextChapter ? "visible" : "hidden" }}
          >
            <ChevronRight />
          </IconButton>
          <IconButton onClick={() => navigate(`/manga/${mangaId}`)}>
            <Home />
          </IconButton>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={() => setZoom(Math.max(50, zoom - 10))}>
              <ZoomOut />
            </IconButton>
            <Slider
              value={zoom}
              onChange={handleZoomChange}
              min={50}
              max={200}
              sx={{ width: 100 }}
            />
            <IconButton onClick={() => setZoom(Math.min(200, zoom + 10))}>
              <ZoomIn />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      {/* Chapter Content - Vertical Scrolling */}
      <Container
        maxWidth="lg"
        sx={{ flexGrow: 1, position: "relative", overflow: "auto" }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 2,
              gap: 3,
            }}
          >
            {pages.length > 0 ? (
              pages.map((page, index) => (
                <Box
                  key={index}
                  component="img"
                  src={page.imageUrl}
                  alt={`Page ${page.pageNumber}`}
                  sx={{
                    width: `${zoom}%`,
                    height: "auto",
                    objectFit: "contain",
                    transition: "transform 0.3s ease",
                  }}
                />
              ))
            ) : (
              <Typography variant="h6" sx={{ mt: 4 }}>
                No pages found for this chapter.
              </Typography>
            )}
          </Box>
        )}
      </Container>

      {/* Chapter List Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }}>
          <List>
            <ListItem>
              <Typography variant="h6">Chapters</Typography>
            </ListItem>
            <Divider />
            {allChapters.length > 0 ? (
              allChapters.map((chap) => (
                <ListItem
                  key={chap.id}
                  button
                  selected={Number(chapterNumber) === chap.chapterNumber}
                  onClick={() =>
                    navigate(`/manga/${mangaId}/chapter/${chap.chapterNumber}`)
                  }
                >
                  <ListItemText
                    primary={`Chapter ${chap.chapterNumber}: ${chap.title}`}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No chapters available" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ChapterReader;

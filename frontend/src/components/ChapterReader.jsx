import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Stack
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
  ZoomIn,
  ZoomOut,
  Home
} from '@mui/icons-material';

// Mock chapter data - in a real app, this would come from an API
const mockChapterContent = {
  pages: [
    'https://example.com/manga/chapter1/page1.jpg',
    'https://example.com/manga/chapter1/page2.jpg',
    'https://example.com/manga/chapter1/page3.jpg',
  ]
};

const ChapterReader = () => {
  const { mangaId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNextPage = () => {
    if (currentPage < mockChapterContent.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Top Bar */}
      <Paper elevation={2} sx={{ py: 1, px: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Chapter {chapterNumber}
          </Typography>
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

      {/* Chapter Content */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, position: 'relative', overflow: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100%',
            py: 2
          }}
        >
          <Box
            component="img"
            src={mockChapterContent.pages[currentPage]}
            alt={`Page ${currentPage + 1}`}
            sx={{
              maxWidth: `${zoom}%`,
              height: 'auto',
              objectFit: 'contain',
              transition: 'transform 0.3s ease'
            }}
          />
        </Box>

        {/* Navigation Buttons */}
        <IconButton
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          sx={{
            position: 'fixed',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <ChevronLeft />
        </IconButton>

        <IconButton
          onClick={handleNextPage}
          disabled={currentPage === mockChapterContent.pages.length - 1}
          sx={{
            position: 'fixed',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <ChevronRight />
        </IconButton>
      </Container>

      {/* Chapter List Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <Box sx={{ width: 250 }}>
          <List>
            <ListItem>
              <Typography variant="h6">Chapters</Typography>
            </ListItem>
            <Divider />
            {Array.from({ length: 10 }, (_, i) => (
              <ListItem
                key={i}
                button
                selected={Number(chapterNumber) === i + 1}
                onClick={() => navigate(`/manga/${mangaId}/chapter/${i + 1}`)}
              >
                <ListItemText primary={`Chapter ${i + 1}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ChapterReader;
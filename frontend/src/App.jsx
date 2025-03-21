import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MangaDetail from './pages/MangaDetail';
import ChapterReader from './components/ChapterReader';
import Ranking from './pages/Ranking';
import AboutUs from './pages/AboutUs';
import Register from './pages/Register';
import Login from './pages/LogIn';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/manga/:id" element={<MangaDetail />} />
              <Route path="/manga/:mangaId/chapter/:chapterNumber" element={<ChapterReader />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  )
}

export default App

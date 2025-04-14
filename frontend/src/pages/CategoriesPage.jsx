import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import categoryService from '../services/categoryService';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug) => {
    navigate(`/category/${categorySlug}`);
  };

  // Function to get a random pastel color for category cards
  const getRandomPastelColor = (index) => {
    const colors = [
      '#FFD6E0', // Pink
      '#FFEFCF', // Yellow
      '#D1F0FF', // Blue
      '#D6FFE1', // Green
      '#E0D6FF', // Purple
      '#FFE1D6', // Orange
      '#E1FFD6', // Lime
      '#D6FFE9', // Mint
      '#D6EAFF', // Light Blue
      '#FFD6EA', // Light Pink
    ];
    return colors[index % colors.length];
  };

  return (
    <Box sx={{ py: 4, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs navigation */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <MuiLink component={Link} to="/" color="inherit">
            Home
          </MuiLink>
          <Typography color="text.primary">Categories</Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', mb: 4 }}>
          Browse Manga by Category
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Box sx={{ py: 4 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : categories.length > 0 ? (
          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    backgroundColor: getRandomPastelColor(index),
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardActionArea 
                    sx={{ height: '100%' }}
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {category.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '30vh',
            }}
          >
            <Typography variant="h5" color="text.secondary">
              No categories found
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CategoriesPage;
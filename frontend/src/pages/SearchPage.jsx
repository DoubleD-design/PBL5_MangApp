import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Box,
  Pagination,
  CircularProgress,
  Chip,
} from "@mui/material";
import MangaCard from "../components/MangaCard";
import searchService from "../services/searchService";
import SearchBar from "../components/SearchBar";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const searchType =
    new URLSearchParams(location.search).get("type") || "title";
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await searchService.searchManga(
          query,
          page,
          12,
          searchType
        );
        setSearchResults(response.content || []);
        setTotalPages(response.totalPages || 0);
      } catch (err) {
        console.error("Error searching manga:", err);
        setError("Failed to load search results. Please try again.");
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page, searchType]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1); // API uses 0-based indexing
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Results for: {query}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <SearchBar />
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : searchResults.length === 0 ? (
        <Typography align="center" my={4}>
          No results found for "{query}". Try a different search term.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {searchResults.map((manga) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={manga.id}>
                <MangaCard manga={manga} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page + 1} // Convert 0-based to 1-based for UI
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchPage;

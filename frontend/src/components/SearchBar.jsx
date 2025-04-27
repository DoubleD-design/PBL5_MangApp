import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  InputBase,
  IconButton,
  Paper,
  Menu,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(
        `/search?q=${encodeURIComponent(query.trim())}&type=${searchType}`
      );
      setQuery("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: { xs: "100%", sm: "auto" },
      }}
    >
      <Button
        id="search-type-button"
        aria-controls={open ? "search-type-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          minWidth: 100,
          mr: 1,
          display: { xs: "none", sm: "flex" },
          bgcolor: "background.paper",
          color: "text.primary",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        {searchType === "title"
          ? "Title"
          : searchType === "author"
          ? "Author"
          : "All"}
      </Button>
      <Menu
        id="search-type-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "search-type-button",
        }}
      >
        <MenuItem onClick={() => handleSearchTypeChange("title")}>
          Title
        </MenuItem>
        <MenuItem onClick={() => handleSearchTypeChange("author")}>
          Author
        </MenuItem>
        <MenuItem onClick={() => handleSearchTypeChange("all")}>All</MenuItem>
      </Menu>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: { xs: "100%", sm: 300 },
          bgcolor: "background.paper",
          borderRadius: 2,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={`Search by ${searchType}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton type="submit" sx={{ p: "10px" }}>
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchBar;

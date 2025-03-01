import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";

const MangaCard = ({ manga }) => {
  return (
    <Card
      component={Link}
      to={`/manga/${manga.id}`}
      sx={{
        position: "relative",
        height: "100%",
        textDecoration: "none",
        backgroundColor: "background.paper",
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow 0.4s ease-in-out",
        "&:hover": {
          boxShadow: "0 16px 30px rgba(255, 103, 64, 0.8)",
          "&:hover .manga-info": {
            backgroundColor: "rgba(0,0,0,0.9)", // Đậm hơn
            transition: "background-color 0.3s ease-out",
          },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          transition: "opacity 0.3s ease-in-out",
          opacity: 0,
          boxShadow: "0 16px 30px rgba(255, 103, 64, 0.8)",
          borderRadius: 2,
        },
        "&:hover::before": {
          opacity: 1,
        },
      }}
    >
      <CardMedia
        component="img"
        image={manga.cover}
        alt={manga.title}
        sx={{
          height: 280,
          width: "100%",
          objectFit: "cover",
          zIndex: 1,
          position: "relative",
          borderRadius: "8px",
        }}
      />
      <Box
        className="manga-info"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          p: 2,
          paddingTop: 2.5,
          paddingBottom: 2.5,
          transition: "background-color 0.3s ease-out, transform 0.3s ease-out",
          transform: "translateY(0)",
          zIndex: 2,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "0.9rem",
            lineHeight: 1.2,
            mb: 0.5,
          }}
          noWrap
        >
          {manga.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.8rem",
            lineHeight: 1.2,
          }}
        >
          {manga.author}
        </Typography>
      </Box>
    </Card>
  );
};

export default MangaCard;

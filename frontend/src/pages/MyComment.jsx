import React from "react";
import { Container, Typography } from "@mui/material";

const MyComment = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Comments
      </Typography>
      <Typography variant="body1">
        This is where your comments will be displayed.
      </Typography>
    </Container>
  );
};

export default MyComment;

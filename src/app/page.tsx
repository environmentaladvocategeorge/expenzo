"use client";

import { Box, Typography, useTheme } from "@mui/material";

const Home = () => {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h2" sx={{ color: theme.palette.primary.main }}>
        Hello, Angie
      </Typography>
    </Box>
  );
};

export default Home;

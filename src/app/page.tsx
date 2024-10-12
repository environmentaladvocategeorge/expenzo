"use client";

import { Box, Typography, useTheme } from "@mui/material";

const Home = () => {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h2" sx={{ color: theme.palette.primary.main }}>
        Welcome, Angie
      </Typography>
      <Typography>
        Welcome to Earth Watcher, the center for all climate disasters.
      </Typography>
    </Box>
  );
};

export default Home;

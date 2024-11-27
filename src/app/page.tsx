"use client";

import { Box, useTheme, Button } from "@mui/material";
import useTellerConnect from "../hooks/useTellerConnect";

const Home = () => {
  const theme = useTheme();
  const openTellerConnect = useTellerConnect("app_p6qtvm8rcc524e1on4000");
  return (
    <Box>
      <Button
        variant="contained"
        onClick={openTellerConnect}
        sx={{ color: theme.palette.neutral.white }}
      >
        Connect Bank
      </Button>
    </Box>
  );
};

export default Home;

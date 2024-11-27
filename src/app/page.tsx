"use client";

import { Box, useTheme, Button, Typography, Divider } from "@mui/material";
import { Add } from "@mui/icons-material";
import useTellerConnect from "../hooks/useTellerConnect";

const Home = () => {
  const theme = useTheme();
  const openTellerConnect = useTellerConnect("app_p6qtvm8rcc524e1on4000");

  return (
    <Box
      sx={{
        borderRadius: theme.spacing(2),
        padding: theme.spacing(4),
        backgroundColor: theme.palette.neutral.white,
      }}
    >
      <Typography variant="h4">Accounts (0)</Typography>
      <Divider
        sx={{
          backgroundColor: theme.palette.neutral.black,
          my: theme.spacing(2),
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={openTellerConnect}
          sx={{
            color: theme.palette.neutral.white,
            ml: "auto",
          }}
          endIcon={<Add />}
        >
          Connect Account
        </Button>
      </Box>
    </Box>
  );
};

export default Home;

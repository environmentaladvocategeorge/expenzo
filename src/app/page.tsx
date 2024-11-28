"use client";

import { Box, useTheme, Button, Typography, Divider } from "@mui/material";
import { Add } from "@mui/icons-material";
import useTellerConnect from "../hooks/useTellerConnect";
import { fetchAccounts } from "@/services/accountService";
import { Account } from "@/types/api";
import { useState, useEffect } from "react";

const Home = () => {
  const theme = useTheme();
  // const openTellerConnect = useTellerConnect(
  //   process.env.NEXT_PUBLIC_APP_ID || ""
  // );

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await fetchAccounts();
        setAccounts(data.accounts);
      } catch (err) {
        console.error(`Error ocurred fetching API: ${err}`);
        setError("Failed to fetch accounts");
      }
    };

    loadAccounts();
  }, []);

  console.log(accounts);

  if (error) return <div>{error}</div>;

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
          // onClick={openTellerConnect}
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

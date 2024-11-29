"use client";

import {
  Box,
  useTheme,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Add, AccountBalance, CreditCard } from "@mui/icons-material";
import useTellerConnect from "../hooks/useTellerConnect";
import { fetchAccounts } from "@/services/accountService";
import { Account } from "@/types/api";
import { useState, useEffect } from "react";

const AccountRow = ({ account }: { account: Account }) => {
  const theme = useTheme();
  const isCreditCard =
    account.type === "credit" && account.subtype === "credit_card";
  const isChecking =
    account.type === "depository" && account.subtype === "checking";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: theme.spacing(2),
        px: theme.spacing(2),
        border: `1px solid ${theme.palette.neutral.gray}`,
        borderRadius: theme.spacing(1),
        mb: theme.spacing(2),
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {isCreditCard && (
          <CreditCard
            sx={{ color: theme.palette.primary.main, mr: theme.spacing(1) }}
          />
        )}
        {isChecking && (
          <AccountBalance
            sx={{ color: theme.palette.secondary.main, mr: theme.spacing(1) }}
          />
        )}
        <Box>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {account.institution.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {account.name}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body1" sx={{ mr: theme.spacing(1) }}>
          ••••
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {account.last_four}
        </Typography>
      </Box>
    </Box>
  );
};

const Home = () => {
  const theme = useTheme();
  const openTellerConnect = useTellerConnect(
    process.env.NEXT_PUBLIC_APP_ID || ""
  );

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await fetchAccounts();
        setAccounts(data.accounts);
      } catch (err) {
        console.error(`Error occurred fetching API: ${err}`);
        setError("Failed to fetch accounts");
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <Box
      sx={{
        borderRadius: theme.spacing(2),
        padding: theme.spacing(4),
        backgroundColor: theme.palette.neutral.white,
      }}
    >
      <Typography variant="h4">Accounts ({accounts?.length})</Typography>

      {loading ? (
        <Box
          sx={{
            width: "100%",
            padding: theme.spacing(4),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={64} />
        </Box>
      ) : (
        <Box>
          {accounts?.map((account) => (
            <AccountRow key={account.id} account={account} />
          ))}
        </Box>
      )}

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

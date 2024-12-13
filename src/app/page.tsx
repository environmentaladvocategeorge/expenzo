"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import useTellerConnect from "../hooks/useTellerConnect";
import { Account as AccountType } from "@/types/api";
import { useAuth } from "@/contexts/AuthenticationContext";
import { fetchAccounts } from "@/services/accountService";
import Account from "@/components/account/Account";

const Home = () => {
  const theme = useTheme();
  const { isAuthenticated, setShowLoginModal, getToken } = useAuth();
  const openTellerConnect = useTellerConnect(
    process.env.NEXT_PUBLIC_APP_ID || ""
  );

  const [debitAccounts, setDebitAccounts] = useState<AccountType[]>([]);
  const [creditAccounts, setCreditAccounts] = useState<AccountType[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthentication = async () => {
      if (!isAuthenticated) {
        setShowLoginModal(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const accountsData = await fetchAccounts(getToken);
        setDebitAccounts(accountsData.debit.accounts);
        setCreditAccounts(accountsData.credit.accounts);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    handleAuthentication();
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated && (
        <>
          <Box
            sx={{
              borderRadius: theme.spacing(2),
              padding: theme.spacing(4),
              backgroundColor: theme.palette.neutral.white,
              margin: theme.spacing(2),
              boxShadow:
                "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography variant="h4" sx={{ mb: theme.spacing(2) }}>
              Debit ({debitAccounts.length})
            </Typography>

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
                <CircularProgress size={56} />
              </Box>
            ) : (
              <Box>
                {debitAccounts.map((account) => (
                  <Account key={account.details.id} account={account} />
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
                  ml: "auto",
                }}
                endIcon={<Add />}
              >
                Connect Account
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              borderRadius: theme.spacing(2),
              padding: theme.spacing(4),
              backgroundColor: theme.palette.neutral.white,
              margin: theme.spacing(2),
              boxShadow:
                "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography variant="h4" sx={{ mb: theme.spacing(2) }}>
              Credit ({creditAccounts.length})
            </Typography>

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
                <CircularProgress size={56} />
              </Box>
            ) : (
              <Box>
                {creditAccounts.map((account) => (
                  <Account key={account.details.id} account={account} />
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
                  ml: "auto",
                }}
                endIcon={<Add />}
              >
                Connect Account
              </Button>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default Home;

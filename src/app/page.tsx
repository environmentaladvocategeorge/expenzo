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
import { SiChase, SiBankofamerica } from "react-icons/si";
import useTellerConnect from "../hooks/useTellerConnect";
import { Account } from "@/types/api";
import { useAuth } from "@/contexts/AuthenticationContext";
import { fetchAccounts } from "@/services/accountService";

const AccountRow = ({ account }: { account: Account }) => {
  const theme = useTheme();
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
        <Box
          sx={{
            width: 32,
            height: 32,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {account.details.institution.id === "chase" ? (
            <SiChase size={28} />
          ) : (
            <SiBankofamerica size={32} />
          )}
        </Box>
        <Box sx={{ marginLeft: theme.spacing(2) }}>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            {account.details.institution.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {account.details.name}
            </Typography>
            <Typography variant="body1" sx={{ mx: theme.spacing(1) }}>
              ••••
            </Typography>
            <Typography variant="body1">{account.details.last_four}</Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", textAlign: "right" }}
        >
          {`$ ${account.balance.ledger}`}
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.neutral.gray }}>
          {`Available: $${account.balance.available}`}
        </Typography>
      </Box>
    </Box>
  );
};

const Home = () => {
  const theme = useTheme();
  const { isAuthenticated, setShowLoginModal, getToken } = useAuth();
  const openTellerConnect = useTellerConnect(
    process.env.NEXT_PUBLIC_APP_ID || ""
  );

  const [debitAccounts, setDebitAccounts] = useState<Account[]>([]);
  const [creditAccounts, setCreditAccounts] = useState<Account[]>([]);

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
        setDebitAccounts(accountsData.debit);
        setCreditAccounts(accountsData.credit);
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
                  <AccountRow key={account.details.id} account={account} />
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
                  <AccountRow key={account.details.id} account={account} />
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

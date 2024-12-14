"use client";

import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import useTellerConnect from "../hooks/useTellerConnect";
import { GetAccountsResponse } from "@/types/api";
import { useAuth } from "@/contexts/AuthenticationContext";
import { fetchAccounts } from "@/services/accountService";
import { formatCurrency } from "@/utils/string_utils";
import AccountAccordion from "@/components/account-accordion/AccountAccordion";

const Home = () => {
  const theme = useTheme();
  const { isAuthenticated, setShowLoginModal, getToken } = useAuth();
  const openTellerConnect = useTellerConnect(
    process.env.NEXT_PUBLIC_APP_ID || ""
  );

  const [accounts, setAccounts] = useState<GetAccountsResponse | null>(null);
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
        setAccounts(accountsData);
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
        <Box
          sx={{
            width: "100%",
            height: "100%",
            padding: theme.spacing(2),
            overflowY: "scroll",
          }}
        >
          {accounts && (
            <Box
              sx={{
                borderRadius: theme.spacing(2),
                padding: theme.spacing(4),
                backgroundColor: theme.palette.neutral.white,
                my: theme.spacing(2),
                boxShadow:
                  "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Typography
                variant="body1"
                sx={{ color: theme.palette.neutral.gray, fontWeight: 700 }}
              >
                NET WORTH
              </Typography>
              <Typography variant="h5">
                {formatCurrency(
                  accounts.debit.total_ledger + accounts.credit.total_ledger
                )}
              </Typography>
            </Box>
          )}
          <AccountAccordion
            title="DEBIT ACCOUNTS"
            balance={accounts?.debit.total_ledger || 0}
            accounts={accounts?.debit.accounts || []}
            loading={loading}
            formatCurrency={formatCurrency}
          />
          <AccountAccordion
            title="CREDIT CARDS"
            balance={accounts?.credit.total_ledger || 0}
            accounts={accounts?.credit.accounts || []}
            loading={loading}
            formatCurrency={formatCurrency}
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
                my: 2,
              }}
              endIcon={<Add />}
            >
              Connect Account
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Home;

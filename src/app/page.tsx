"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Typography,
  Skeleton,
  Grid2,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import useTellerConnect from "../hooks/useTellerConnect";
import { GetAccountsResponse } from "@/types/api";
import { useAuth } from "@/contexts/AuthenticationContext";
import { fetchAccounts } from "@/services/accountService";
import { formatCurrency } from "@/utils/string_utils";
import {
  AccountAccordion,
  AccountSummary,
  AccountSummarySkeleton,
} from "@/components";

const Home = () => {
  const theme = useTheme();
  const { isAuthenticated, setShowLoginModal, getToken, getUserName } =
    useAuth();
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
            padding: theme.spacing(4),
            overflowY: "scroll",
          }}
        >
          <Box p={2}>
            <Typography variant="h4">Overview</Typography>
            <Typography sx={{ color: theme.palette.neutral.gray }}>
              {`Welcome home, ${getUserName()}`}
            </Typography>
          </Box>
          <Box
            sx={{
              borderRadius: theme.spacing(2),
              padding: theme.spacing(3),
              backgroundColor: theme.palette.neutral.lightGray,
              my: theme.spacing(2),
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="body1"
                sx={{ color: theme.palette.neutral.gray, fontWeight: 700 }}
              >
                Net Worth
              </Typography>
              {loading || !accounts ? (
                <Skeleton
                  sx={{
                    height: "32px",
                    width: "120px",
                  }}
                />
              ) : (
                <Typography variant="h5">
                  {formatCurrency(
                    accounts.debit.total_ledger + accounts.credit.total_ledger
                  )}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              onClick={openTellerConnect}
              sx={{
                ml: "auto",
                my: 2,
              }}
              disabled={loading}
              endIcon={<Add />}
            >
              Connect Account
            </Button>
          </Box>

          <Grid2 container spacing={2}>
            <Grid2 size={8}>
              <Box>
                <AccountAccordion
                  title="Debit Accounts"
                  balance={accounts?.debit.total_ledger || 0}
                  accounts={accounts?.debit.accounts || []}
                  loading={loading}
                  formatCurrency={formatCurrency}
                />
                <AccountAccordion
                  title="Credit Cards"
                  balance={accounts?.credit.total_ledger || 0}
                  accounts={accounts?.credit.accounts || []}
                  loading={loading}
                  formatCurrency={formatCurrency}
                />
              </Box>
            </Grid2>

            <Grid2 size={4}>
              {loading ? (
                <AccountSummarySkeleton />
              ) : (
                <AccountSummary
                  accounts={accounts}
                  formatCurrency={formatCurrency}
                />
              )}
            </Grid2>
          </Grid2>
        </Box>
      )}
    </>
  );
};

export default Home;

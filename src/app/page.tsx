"use client";

import React from "react";
import {
  Box,
  useTheme,
  Button,
  Typography,
  Skeleton,
  Grid2 as Grid,
} from "@mui/material";
import { Add, HomeOutlined } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthenticationContext";
import { formatCurrency } from "@/utils/string_utils";
import {
  AccountAccordion,
  AccountSummary,
  AccountSummarySkeleton,
} from "@/components";
import useTellerConnect from "../hooks/useTellerConnect";
import { useAccounts } from "@/contexts/AccountsContext";

const Home: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated, getUserName } = useAuth();
  const { accounts, accountsLoading } = useAccounts();
  const openTellerConnect = useTellerConnect(
    process.env.NEXT_PUBLIC_APP_ID || ""
  );

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
          <Box p={2} sx={{ marginBottom: theme.spacing(2) }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(3),
              }}
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.neutral.lightGray,
                  color: theme.palette.neutral.gray,
                  width: theme.spacing(6),
                  height: theme.spacing(6),
                  display: "flex",
                  borderRadius: theme.spacing(1),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <HomeOutlined
                  sx={{
                    width: theme.spacing(4),
                    height: theme.spacing(4),
                    color: theme.palette.neutral.gray,
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h5">Dashboard</Typography>
                <Typography sx={{ color: theme.palette.neutral.gray }}>
                  {`Welcome, ${getUserName()}`}
                </Typography>
              </Box>
            </Box>
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
              {accountsLoading || !accounts ? (
                <Skeleton sx={{ height: "32px", width: "120px" }} />
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
              sx={{ ml: "auto", my: 2 }}
              disabled={accountsLoading}
              endIcon={<Add />}
            >
              Connect Account
            </Button>
          </Box>

          <Grid container spacing={2}>
            <Grid size={8}>
              <Box>
                <AccountAccordion
                  title="Debit Accounts"
                  balance={accounts?.debit.total_ledger || 0}
                  accounts={accounts?.debit.accounts || []}
                  loading={accountsLoading}
                  formatCurrency={formatCurrency}
                />
                <AccountAccordion
                  title="Credit Cards"
                  balance={accounts?.credit.total_ledger || 0}
                  accounts={accounts?.credit.accounts || []}
                  loading={accountsLoading}
                  formatCurrency={formatCurrency}
                />
              </Box>
            </Grid>

            <Grid size={4}>
              {accountsLoading ? (
                <AccountSummarySkeleton />
              ) : (
                <AccountSummary
                  accounts={accounts}
                  formatCurrency={formatCurrency}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Home;

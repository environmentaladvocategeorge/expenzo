import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Skeleton,
  Divider,
  useTheme,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import Account from "../account/Account";
import { Account as AccountType } from "@/types/api";
import AccountSkeleton from "../skeletons/account-skeleton/AccountSkeleton";

interface AccountAccordionProps {
  title: string;
  balance: number;
  accounts: AccountType[];
  loading: boolean;
  formatCurrency: (value: number) => string;
}

const AccountAccordion = ({
  title,
  balance,
  accounts,
  loading,
  formatCurrency,
}: AccountAccordionProps) => {
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (!loading && accounts.length === 0) {
      setExpanded(false);
    }
  }, [loading, accounts]);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        padding: 3,
        my: 2,
        backgroundColor: theme.palette.neutral.lightGray,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "neutral.gray",
            }}
          >
            {`${title} ${accounts.length > 0 ? `(${accounts.length})` : ""}`}
          </Typography>
          {loading ? (
            <Skeleton
              sx={{
                height: "32px",
                width: "120px",
              }}
            />
          ) : (
            <Typography variant="h6">{formatCurrency(balance)}</Typography>
          )}
        </Box>

        <IconButton
          onClick={handleToggle}
          sx={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <ExpandMore />
        </IconButton>
      </Box>

      <Divider
        sx={{
          height: "4px",
          borderRadius: "8px",
          backgroundColor: theme.palette.primary.main,
          marginTop: "8px",
          marginBottom: "8px",
        }}
      />

      <Collapse in={expanded} timeout="auto">
        {loading ? (
          <Box sx={{ marginTop: 1 }}>
            <AccountSkeleton />
            <AccountSkeleton />
            <AccountSkeleton />
          </Box>
        ) : (
          <Box
            sx={{
              height: "192px",
              overflowY: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {accounts?.map((account) => (
              <Account key={account.details.id} account={account} />
            ))}
          </Box>
        )}
      </Collapse>
    </Box>
  );
};

export default AccountAccordion;

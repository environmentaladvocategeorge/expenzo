import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Collapse,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import Account from "../account/Account";
import { Account as AccountType } from "@/types/api";

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

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        padding: 4,
        my: 2,
        backgroundColor: "neutral.white",
        boxShadow:
          "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.05)",
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
            {title}
          </Typography>
          <Typography variant="h6">{formatCurrency(balance)}</Typography>
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

      <Collapse in={expanded} timeout="auto">
        {loading ? (
          <Box
            sx={{
              width: "100%",
              padding: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size={56} />
          </Box>
        ) : (
          <Box sx={{ marginTop: 2 }}>
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

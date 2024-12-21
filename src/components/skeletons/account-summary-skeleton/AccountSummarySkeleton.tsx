import React from "react";
import { Box, Typography, Divider, Skeleton } from "@mui/material";

const AccountSummarySkeleton = () => {
  const labels = [
    "Total Debit Balance",
    "Total Credit Balance",
    "Net Worth",
    "Total Credit Limit",
    "Credit-to-Debit Ratio",
    "Credit Utilization",
    "Liquidity Ratio",
    "Total Available Debit Balance",
    "Total Available Credit Balance",
    "Net Available Balance",
  ];

  return (
    <Box
      sx={(theme) => ({
        borderRadius: 2,
        padding: 3,
        my: 2,
        backgroundColor: theme.palette.neutral.lightGray,
      })}
    >
      <Typography
        variant="body1"
        sx={{ color: "neutral.gray", fontWeight: 700 }}
      >
        SUMMARY
      </Typography>
      <Divider
        sx={{
          height: "4px",
          borderRadius: "8px",
          backgroundColor: "primary.main",
          marginBottom: "16px",
          my: 1,
        }}
      />
      {labels.map((label, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: index < labels.length - 1 ? 1 : 0,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "62%",
              fontWeight: 500,
            }}
          >
            {label}
          </Typography>
          <Skeleton
            variant="text"
            width="25%"
            height={20}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default AccountSummarySkeleton;

"use client";

import React from "react";
import { Box, useTheme, Typography, Divider } from "@mui/material";
import { AttachMoneyOutlined } from "@mui/icons-material";
import { useTransactions } from "@/contexts/TransactionsContext";

const Transactions = () => {
  const theme = useTheme();
  const { transactionsLoading, getCategorizedTransactions } = useTransactions();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        padding: theme.spacing(4),
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
            <AttachMoneyOutlined
              sx={{
                width: theme.spacing(4),
                height: theme.spacing(4),
                color: theme.palette.neutral.gray,
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5">Budgets</Typography>
            <Typography sx={{ color: theme.palette.neutral.gray }}>
              {`Track and monitor your monthly spending all in one place.`}
            </Typography>
          </Box>
        </Box>
      </Box>

      {transactionsLoading ? (
        <Typography>Loading transactions...</Typography>
      ) : (
        <Box>
          {Object.entries(getCategorizedTransactions()).map(
            ([category, transactions]) => (
              <Box key={category} sx={{ marginBottom: theme.spacing(3) }}>
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
                    {category}
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
                  {transactions.map((transaction, index) => (
                    <Box
                      key={transaction.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: index < transactions.length - 1 ? 1 : 0,
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
                        {transaction.id}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "25%",
                          textAlign: "right",
                        }}
                      >
                        {transaction.amount}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )
          )}
        </Box>
      )}
    </Box>
  );
};

export default Transactions;

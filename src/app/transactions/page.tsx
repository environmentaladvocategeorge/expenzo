"use client";

import React from "react";
import { Box, useTheme, Typography, Pagination } from "@mui/material";
import { ReceiptOutlined } from "@mui/icons-material";
import { useTransactions } from "@/contexts/TransactionsContext";
import { useAccounts } from "@/contexts/AccountsContext";
import { TransactionsTable } from "@/components";

const Transactions = () => {
  const theme = useTheme();
  const {
    transactionsLoading,
    currentPage,
    totalPages,
    paginatedTransactions,
    setCurrentPage,
  } = useTransactions();

  const { getAccountById, accountsLoading } = useAccounts();

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

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
            <ReceiptOutlined
              sx={{
                width: theme.spacing(4),
                height: theme.spacing(4),
                color: theme.palette.neutral.gray,
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5">Transactions</Typography>
            <Typography sx={{ color: theme.palette.neutral.gray }}>
              {`View all of your transactions across your connected accounts in one place.`}
            </Typography>
          </Box>
        </Box>
      </Box>

      <TransactionsTable
        transactionsLoading={transactionsLoading}
        accountsLoading={accountsLoading}
        paginatedTransactions={paginatedTransactions}
        getAccountById={getAccountById}
        theme={theme}
      />

      {!transactionsLoading && !accountsLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            showFirstButton
            showLastButton
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default Transactions;

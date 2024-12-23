"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Skeleton,
} from "@mui/material";
import { GetTransactionsResponse } from "@/types/api";
import { useAuth } from "@/contexts/AuthenticationContext";
import { fetchTransactions } from "@/services/transactionService";
import { formatCurrency } from "@/utils/string_utils";

const Transactions = () => {
  const theme = useTheme();
  const { isAuthenticated, setShowLoginModal, getToken } = useAuth();
  const [transactions, setTransactions] =
    useState<GetTransactionsResponse | null>(null);
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
        const transcationsData = await fetchTransactions(getToken);
        setTransactions(transcationsData);
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
          }}
        >
          <Box p={2}>
            <Typography variant="h4">Transactions</Typography>
          </Box>
          <Box>
            <TableContainer component={Paper} sx={{ maxHeight: "750px" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Processing Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading
                    ? Array.from({ length: 7 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Skeleton width="80%" />
                          </TableCell>
                          <TableCell>
                            <Skeleton width="90%" />
                          </TableCell>
                          <TableCell>
                            <Skeleton width="60%" />
                          </TableCell>
                          <TableCell>
                            <Skeleton width="70%" />
                          </TableCell>
                          <TableCell>
                            <Skeleton width="50%" />
                          </TableCell>
                          <TableCell>
                            <Skeleton width="80%" />
                          </TableCell>
                        </TableRow>
                      ))
                    : transactions?.transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            {transaction.details.category || "N/A"}
                          </TableCell>
                          <TableCell>
                            {transaction.details.processing_status}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Transactions;

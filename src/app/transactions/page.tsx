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
  Pagination,
} from "@mui/material";
import { ReceiptOutlined } from "@mui/icons-material";
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = transactions
    ? Math.ceil(transactions.transactions.length / itemsPerPage)
    : 1;

  useEffect(() => {
    const handleAuthentication = async () => {
      if (!isAuthenticated) {
        setShowLoginModal(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const transactionsData = await fetchTransactions(getToken);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    handleAuthentication();
  }, [isAuthenticated]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const paginatedTransactions =
    transactions?.transactions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h5">Transactions</Typography>
                <Typography sx={{ color: theme.palette.neutral.gray }}>
                  {`View all of your transactions across your connected accounts in one place.`}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: "750px",
                borderRadius: "16px",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {[
                      "Description",
                      "Date",
                      "Amount",
                      "Category",
                      "Processing Status",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: "bold",
                          backgroundColor: theme.palette.neutral.lightGray,
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading
                    ? Array.from({ length: itemsPerPage }).map((_, index) => (
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
                        </TableRow>
                      ))
                    : paginatedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {transaction.description}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {transaction.date}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>
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
          {!loading && (
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
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default Transactions;

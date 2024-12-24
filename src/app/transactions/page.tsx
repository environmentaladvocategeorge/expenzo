"use client";

import React from "react";
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
import { useTransactions } from "@/contexts/TransactionsContext";
import { formatCurrency } from "@/utils/string_utils";
import { useAccounts } from "@/contexts/AccountsContext";

import {
  SiChase,
  SiBankofamerica,
  SiWellsfargo,
  SiAmericanexpress,
} from "react-icons/si";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdOutlinePayments, MdOutlinePending } from "react-icons/md";

const getInstitutionIcon = (institutionId: string) => {
  switch (institutionId) {
    case "chase":
      return <SiChase size={28} />;
    case "bank_of_america":
      return <SiBankofamerica size={32} />;
    case "american_express":
      return <SiAmericanexpress size={32} />;
    case "wells_fargo":
      return <SiWellsfargo size={32} />;
    default:
      return <MdOutlinePayments size={32} />;
  }
};

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

  const generateAccountCell = (accountId: string) => {
    const accountDetails = getAccountById(accountId)?.details;

    if (!accountDetails) {
      return (
        <TableCell>
          <Typography
            sx={{ fontSize: "12px", color: theme.palette.neutral.darkGray }}
          >
            Account details not available
          </Typography>
        </TableCell>
      );
    }

    return (
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {getInstitutionIcon(accountDetails.institution.id)}
          <Box sx={{ ml: 1 }}>
            <Typography sx={{ fontSize: "12px", fontWeight: 700 }}>
              {accountDetails.last_four}
            </Typography>
            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>
              {accountDetails.institution.name}
            </Typography>
          </Box>
        </Box>
      </TableCell>
    );
  };

  const generateStatusCell = (status: string) => {
    return (
      <TableCell>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: "8px",
            padding: "4px 8px",
            backgroundColor:
              status === "posted" ? "#d5f0dd" : theme.palette.neutral.lightGray,
            color:
              status === "posted" ? "#248f44" : theme.palette.neutral.darkGray,
          }}
        >
          {status === "pending" ? (
            <MdOutlinePending />
          ) : (
            <IoCheckmarkDoneOutline />
          )}
          <Box sx={{ ml: 1 }}>
            <Typography sx={{ fontSize: "12px", fontWeight: 700 }}>
              {status === "posted" ? "Completed" : "Pending"}
            </Typography>
          </Box>
        </Box>
      </TableCell>
    );
  };

  return (
    <>
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
            <Table sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: theme.palette.neutral.lightGray,
                  }}
                >
                  <TableCell sx={{ width: "14.29%" }}>Date</TableCell>
                  <TableCell
                    sx={{
                      width: "28.57%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Description
                  </TableCell>
                  <TableCell sx={{ width: "14.29%" }}>Amount</TableCell>
                  <TableCell sx={{ width: "14.29%" }}>Category</TableCell>
                  <TableCell sx={{ width: "14.29%" }}>Account</TableCell>
                  <TableCell sx={{ width: "14.29%" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactionsLoading || accountsLoading
                  ? Array.from({ length: 12 }).map((_, index) => (
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
                          <Skeleton width="50%" />
                        </TableCell>
                      </TableRow>
                    ))
                  : paginatedTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        sx={{
                          backgroundColor:
                            transaction.status === "pending"
                              ? theme.palette.neutral.lightGray
                              : "transparent",
                        }}
                      >
                        <TableCell sx={{ width: "14.29%", fontWeight: 500 }}>
                          {new Date(transaction.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "28.57%",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {transaction.description}
                        </TableCell>
                        <TableCell sx={{ width: "14.29%", fontWeight: 500 }}>
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell sx={{ width: "14.29%", fontWeight: 500 }}>
                          {transaction.details.category || "N/A"}
                        </TableCell>
                        {generateAccountCell(transaction.account_id)}
                        {generateStatusCell(transaction.status)}
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
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
    </>
  );
};

export default Transactions;

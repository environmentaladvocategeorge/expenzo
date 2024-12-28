import React, { useState } from "react";
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVert as TransactionActionsIcon } from "@mui/icons-material";
import { formatCurrency } from "@/utils/string_utils";
import {
  SiChase,
  SiBankofamerica,
  SiWellsfargo,
  SiAmericanexpress,
} from "react-icons/si";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdOutlinePayments, MdOutlinePending } from "react-icons/md";
import { TiEdit } from "react-icons/ti";
import TransactionModal from "@/modals/transaction-modal/TransactionModal";

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

const TransactionsTable = ({
  transactionsLoading,
  accountsLoading,
  paginatedTransactions,
  getAccountById,
  theme,
}: {
  transactionsLoading: boolean;
  accountsLoading: boolean;
  paginatedTransactions: any[];
  getAccountById: (accountId: string) => any;
  theme: any;
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  const [showEditTransactionModal, setShowEditTransactionModal] =
    useState(false);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    transactionId: string
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedTransactionId(transactionId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedTransactionId(null);
  };

  const generateAccountCell = (accountId: string) => {
    const accountDetails = getAccountById(accountId)?.details;

    if (!accountDetails) {
      return (
        <TableCell sx={{ width: "11.75%" }}>
          <Typography
            sx={{ fontSize: "12px", color: theme.palette.neutral.darkGray }}
          >
            Account details not available
          </Typography>
        </TableCell>
      );
    }

    return (
      <TableCell sx={{ width: "11.75%" }}>
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
      <TableCell sx={{ width: "11.75%" }}>
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
      <TransactionModal
        open={showEditTransactionModal}
        onClose={() => setShowEditTransactionModal(false)}
        transactionId={selectedTransactionId || ""}
      />
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
              <TableCell sx={{ width: "11.75%" }}>Date</TableCell>
              <TableCell
                sx={{
                  width: "23.5%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Description
              </TableCell>
              <TableCell sx={{ width: "11.75%" }}>Amount</TableCell>
              <TableCell sx={{ width: "11.75%" }}>Category</TableCell>
              <TableCell sx={{ width: "11.75%" }}>Account</TableCell>
              <TableCell sx={{ width: "11.75%" }}>Status</TableCell>
              <TableCell sx={{ width: "6%" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactionsLoading || accountsLoading
              ? Array.from({ length: 9 }).map((_, index) => (
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
                    <TableCell>
                      <IconButton disabled>
                        <TransactionActionsIcon />
                      </IconButton>
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
                    <TableCell sx={{ width: "11.75%", fontWeight: 500 }}>
                      {transaction.status === "pending"
                        ? "---"
                        : new Date(transaction.date).toLocaleDateString(
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
                        width: "23.5%",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {transaction.description}
                    </TableCell>
                    <TableCell sx={{ width: "11.75%", fontWeight: 500 }}>
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell sx={{ width: "11.75%", fontWeight: 500 }}>
                      {transaction.details.category || "N/A"}
                    </TableCell>
                    {generateAccountCell(transaction.account_id)}
                    {generateStatusCell(transaction.status)}
                    <TableCell
                      sx={{
                        width: "6%",
                        fontWeight: 500,
                      }}
                    >
                      <IconButton
                        onClick={(event) =>
                          handleMenuOpen(event, transaction.id)
                        }
                      >
                        <TransactionActionsIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          sx={{
            "& .MuiPaper-root": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              borderRadius: "8px",
            },
          }}
        >
          <MenuItem
            onClick={() => setShowEditTransactionModal(true)}
            sx={(theme) => ({
              color: theme.palette.neutral.gray,
            })}
          >
            <TiEdit size="18px" />
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                marginTop: "2px",
                marginLeft: "4px",
              }}
            >
              Edit Transaction
            </Typography>
          </MenuItem>
        </Menu>
      </TableContainer>
    </>
  );
};

export default TransactionsTable;

"use client";

import React, { useState } from "react";
import {
  Box,
  useTheme,
  Typography,
  Divider,
  Skeleton,
  ButtonGroup,
  Button,
} from "@mui/material";
import {
  AttachMoneyOutlined,
  ViewCompactAltOutlined,
  ViewStreamOutlined,
} from "@mui/icons-material";
import { useTransactions } from "@/contexts/TransactionsContext";
import { Transaction } from "@/types/api";
import { formatCurrency } from "@/utils/string_utils";

const Transactions = () => {
  const theme = useTheme();
  const { transactionsLoading, getCategorizedTransactions } = useTransactions();
  const [isCompact, setIsCompact] = useState(false);

  const calculateCategoryTotal = (transactions: Transaction[]) => {
    return transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  };

  const calculateTotalMonthlySpending = () => {
    const categories = getCategorizedTransactions();
    let total = 0;

    Object.entries(categories)
      .filter(([category]) => category !== "Transfer")
      .forEach(([, transactions]) => {
        total += calculateCategoryTotal(transactions);
      });

    return total;
  };

  const totalMonthlySpending = calculateTotalMonthlySpending();

  return (
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: theme.spacing(3),
          borderRadius: 2,
          backgroundColor: theme.palette.neutral.lightGray,
          my: 2,
        }}
      >
        {transactionsLoading ? (
          <>
            <Typography
              variant="body1"
              sx={{ color: "neutral.gray", fontWeight: 700 }}
            >
              Total Monthly Spending
            </Typography>
            <Skeleton variant="text" width="5%" />
          </>
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{ color: "neutral.gray", fontWeight: 700 }}
            >
              Total Monthly Spending
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                textAlign: "right",
              }}
            >
              {formatCurrency(totalMonthlySpending)}
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <ButtonGroup
          variant="contained"
          aria-label="transaction view mode"
          sx={{
            border: `2px solid ${
              transactionsLoading
                ? theme.palette.neutral.gray
                : theme.palette.primary.main
            }`,
            borderRadius: 2,
          }}
        >
          <Button
            onClick={() => setIsCompact(true)}
            sx={{
              backgroundColor: isCompact
                ? theme.palette.primary.main
                : "transparent",
              color: isCompact ? "#fff" : theme.palette.primary.main,
            }}
            disabled={transactionsLoading}
          >
            <ViewCompactAltOutlined />
          </Button>
          <Button
            onClick={() => setIsCompact(false)}
            sx={{
              backgroundColor: !isCompact
                ? theme.palette.primary.main
                : "transparent",
              color: !isCompact ? "#fff" : theme.palette.primary.main,
            }}
            disabled={transactionsLoading}
          >
            <ViewStreamOutlined />
          </Button>
        </ButtonGroup>
      </Box>

      {transactionsLoading ? (
        <Box>
          {Array.from({ length: 3 }).map((_, index) => (
            <Box key={index} sx={{ marginBottom: theme.spacing(3) }}>
              <Box
                sx={(theme) => ({
                  borderRadius: 2,
                  padding: 3,
                  my: 2,
                  backgroundColor: theme.palette.neutral.lightGray,
                })}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Skeleton variant="text" width="15%" />
                  <Skeleton variant="text" width="5%" />
                </Box>
                <Divider
                  sx={{
                    height: "4px",
                    borderRadius: "8px",
                    backgroundColor: "primary.main",
                    marginBottom: "16px",
                    my: 1,
                  }}
                />
                {Array.from({ length: 3 }).map((_, subIndex) => (
                  <Box
                    key={subIndex}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      marginBottom: subIndex < 2 ? 1 : 0,
                    }}
                  >
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="text" width="5%" />
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box>
          {isCompact ? (
            <Box sx={{ marginBottom: theme.spacing(3) }}>
              <Box
                sx={(theme) => ({
                  borderRadius: 2,
                  padding: 3,
                  my: 2,
                  backgroundColor: theme.palette.neutral.lightGray,
                })}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ color: "neutral.gray", fontWeight: 700 }}
                  >
                    Spending Categories
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    height: "4px",
                    borderRadius: "8px",
                    backgroundColor: "primary.main",
                    marginBottom: "16px",
                    my: 1,
                  }}
                />

                {Object.entries(getCategorizedTransactions())
                  .filter(([category]) => category !== "Transfer")
                  .map(([category, transactions]) => {
                    const categoryTotal = calculateCategoryTotal(transactions);

                    return (
                      <Box
                        key={category}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          marginBottom: theme.spacing(1),
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            textOverflow: "ellipsis",
                            maxWidth: "62%",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {category}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            textAlign: "right",
                            textOverflow: "ellipsis",
                            maxWidth: "25%",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatCurrency(categoryTotal)}
                        </Typography>
                      </Box>
                    );
                  })}
              </Box>
            </Box>
          ) : (
            Object.entries(getCategorizedTransactions())
              .filter(([category]) => category !== "Transfer")
              .map(([category, transactions]) => {
                const categoryTotal = calculateCategoryTotal(transactions);

                return (
                  <Box key={category} sx={{ marginBottom: theme.spacing(3) }}>
                    <Box
                      sx={(theme) => ({
                        borderRadius: 2,
                        padding: 3,
                        my: 2,
                        backgroundColor: theme.palette.neutral.lightGray,
                      })}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ color: "neutral.gray", fontWeight: 700 }}
                        >
                          {category}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            textAlign: "right",
                          }}
                        >
                          {formatCurrency(categoryTotal)}
                        </Typography>
                      </Box>
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
                            marginBottom:
                              index < transactions.length - 1 ? 1 : 0,
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
                            {transaction.description}
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
                            {formatCurrency(transaction.amount)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                );
              })
          )}
        </Box>
      )}
    </Box>
  );
};

export default Transactions;

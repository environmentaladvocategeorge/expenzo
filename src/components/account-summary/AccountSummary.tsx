import React from "react";
import { Box, Typography, Divider, Tooltip } from "@mui/material";
import { GetAccountsResponse } from "@/types/api";

interface AccountSummaryProps {
  accounts: GetAccountsResponse | null;
  formatCurrency: (value: number) => string;
}

const computeStatistics = (
  accounts: GetAccountsResponse | null,
  formatCurrency: (value: number) => string
) => {
  if (!accounts) {
    return [];
  }

  const safeDivide = (numerator: number, denominator: number) =>
    denominator > 0 ? (numerator / denominator) * 100 : 0;

  const totalCreditLimit =
    Math.abs(accounts.credit.total_ledger) + accounts.credit.total_available;

  const usedCredit = totalCreditLimit - accounts.credit.total_available;

  return [
    {
      label: "Total Debit Balance",
      value: formatCurrency(accounts.debit.total_ledger),
      tooltipLabel:
        "The total amount of funds currently held in all debit accounts.",
      tooltipValue: `Total balance across your ${
        accounts.debit.accounts.length
      } debit accounts is ${formatCurrency(accounts.debit.total_ledger)}.`,
    },
    {
      label: "Total Credit Balance",
      value: formatCurrency(accounts.credit.total_ledger),
      tooltipLabel:
        "The total amount of credit currently allocated across all credit accounts.",
      tooltipValue: `The total balance across your ${
        accounts.credit.accounts.length
      } credit accounts is ${formatCurrency(
        accounts.credit.total_ledger
      )}. This is a negative balance representing your total liabilities.`,
    },
    {
      label: "Net Worth",
      value: formatCurrency(
        accounts.debit.total_ledger - Math.abs(accounts.credit.total_ledger)
      ),
      tooltipLabel:
        "The difference between your total assets (debit balance) and liabilities (credit balance).",
      tooltipValue: `Your net worth is calculated by subtracting your total credit balance (liabilities) (${formatCurrency(
        accounts.credit.total_ledger
      )}) from your total debit balance (assets) (${formatCurrency(
        accounts.debit.total_ledger
      )}). Your net worth is ${formatCurrency(
        accounts.debit.total_ledger - Math.abs(accounts.credit.total_ledger)
      )}.`,
    },
    {
      label: "Total Credit Limit",
      value: formatCurrency(
        Math.abs(accounts.credit.total_ledger) + accounts.credit.total_available
      ),
      tooltipLabel: "The total credit limit across all your credit accounts.",
      tooltipValue: `Your total credit limit is the sum of your total credit balance (${formatCurrency(
        Math.abs(accounts.credit.total_ledger)
      )}) and the available credit (${formatCurrency(
        accounts.credit.total_available
      )}). The total credit limit is ${formatCurrency(
        Math.abs(accounts.credit.total_ledger) + accounts.credit.total_available
      )}.`,
    },
    {
      label: "Credit-to-Debit Ratio",
      value: `${safeDivide(
        Math.abs(accounts.credit.total_ledger),
        accounts.debit.total_ledger
      ).toFixed(2)}%`,
      tooltipLabel:
        "The ratio of your total credit balance compared to your total debit balance.",
      tooltipValue: `This ratio compares the absolute value of your total credit balance (${formatCurrency(
        Math.abs(accounts.credit.total_ledger)
      )}) to your total debit balance (${formatCurrency(
        accounts.debit.total_ledger
      )}). The ratio is ${safeDivide(
        Math.abs(accounts.credit.total_ledger),
        accounts.debit.total_ledger
      ).toFixed(2)}%.`,
    },
    {
      label: "Credit Utilization",
      value: `${safeDivide(Math.abs(usedCredit), totalCreditLimit).toFixed(
        2
      )}%`,
      tooltipLabel:
        "The percentage of your total credit limit that has been utilized.",
      tooltipValue: `Credit utilization is calculated as the amount of credit you've used (${formatCurrency(
        Math.abs(usedCredit)
      )}) divided by your total credit limit (${formatCurrency(
        totalCreditLimit
      )}), resulting in a utilization of ${safeDivide(
        usedCredit,
        totalCreditLimit
      ).toFixed(2)}%.`,
    },
    {
      label: "Liquidity Ratio",
      value: `${safeDivide(
        accounts.debit.total_available,
        accounts.debit.total_ledger
      ).toFixed(2)}%`,
      tooltipLabel:
        "The percentage of your debit balance that is readily available for use.",
      tooltipValue: `The liquidity ratio shows the proportion of your total debit balance (${formatCurrency(
        accounts.debit.total_ledger
      )}) that is available for immediate use, calculated as ${formatCurrency(
        accounts.debit.total_available
      )} / ${formatCurrency(
        accounts.debit.total_ledger
      )}. The liquidity ratio is ${safeDivide(
        accounts.debit.total_available,
        accounts.debit.total_ledger
      ).toFixed(2)}%.`,
    },
    {
      label: "Total Available Debit Balance",
      value: formatCurrency(accounts.debit.total_available),
      tooltipLabel:
        "The amount of liquid funds currently available in your debit accounts.",
      tooltipValue: `The available balance in your debit accounts is ${formatCurrency(
        accounts.debit.total_available
      )}. This is the portion of your debit balance that is not reserved or restricted.`,
    },
    {
      label: "Total Available Credit Balance",
      value: formatCurrency(accounts.credit.total_available),
      tooltipLabel:
        "The unused portion of your credit limit available for spending.",
      tooltipValue: `The available portion of your total credit limit across all credit accounts is ${formatCurrency(
        accounts.credit.total_available
      )}. This represents the amount you can still borrow.`,
    },
    {
      label: "Net Available Balance",
      value: formatCurrency(
        accounts.debit.total_available + accounts.credit.total_available
      ),
      tooltipLabel:
        "The total liquid funds accessible, combining available debit and credit balances.",
      tooltipValue: `The net available balance combines your available debit balance (${formatCurrency(
        accounts.debit.total_available
      )}) and available credit balance (${formatCurrency(
        accounts.credit.total_available
      )}). The total is ${formatCurrency(
        accounts.debit.total_available + accounts.credit.total_available
      )}.`,
    },
  ];
};

const AccountSummary = ({ accounts, formatCurrency }: AccountSummaryProps) => {
  const statistics = computeStatistics(accounts, formatCurrency);

  return (
    <Box
      sx={(theme) => ({
        borderRadius: 2,
        padding: 4,
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
      {statistics.map((stat, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: index < statistics.length - 1 ? 1 : 0,
          }}
        >
          <Tooltip title={stat.tooltipLabel} arrow placement="left">
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
              {stat.label}
            </Typography>
          </Tooltip>
          <Tooltip title={stat.tooltipValue} arrow>
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
              {stat.value}
            </Typography>
          </Tooltip>
        </Box>
      ))}
    </Box>
  );
};

export default AccountSummary;

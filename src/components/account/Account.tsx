import { Account as AccountType } from "@/types/api";
import { Box, Typography, useTheme } from "@mui/material";
import { SiChase, SiBankofamerica } from "react-icons/si";

const Account = ({ account }: { account: AccountType }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: theme.spacing(2),
        px: theme.spacing(2),
        border: `1px solid ${theme.palette.neutral.gray}`,
        borderRadius: theme.spacing(1),
        mb: theme.spacing(2),
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {account.details.institution.id === "chase" ? (
            <SiChase size={28} />
          ) : (
            <SiBankofamerica size={32} />
          )}
        </Box>
        <Box sx={{ marginLeft: theme.spacing(2) }}>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            {account.details.institution.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {account.details.name}
            </Typography>
            <Typography variant="body1" sx={{ mx: theme.spacing(1) }}>
              ••••
            </Typography>
            <Typography variant="body1">{account.details.last_four}</Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", textAlign: "right" }}
        >
          {`$ ${account.balance.ledger}`}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.neutral.gray }}>
          {`Available: $${account.balance.available}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default Account;

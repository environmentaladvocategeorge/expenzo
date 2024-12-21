import { Account as AccountType } from "@/types/api";
import { Box, Typography, useTheme } from "@mui/material";
import {
  SiChase,
  SiBankofamerica,
  SiWellsfargo,
  SiAmericanexpress,
} from "react-icons/si";
import { MdOutlinePayments } from "react-icons/md";
import { formatCurrency } from "@/utils/string_utils";

const Account = ({ account }: { account: AccountType }) => {
  const theme = useTheme();

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

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: theme.spacing(1.5),
        borderBottom: `1px solid ${theme.palette.neutral.gray}`,
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
          {getInstitutionIcon(account.details.institution.id)}
        </Box>
        <Box sx={{ marginLeft: theme.spacing(2) }}>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {account.details.institution.name}
          </Typography>
          <Typography variant="body2">{account.details.name}</Typography>
        </Box>
      </Box>
      <Box>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", textAlign: "right" }}
        >
          {formatCurrency(account.balance.ledger)}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.neutral.gray, fontWeight: 500 }}
        >
          {`Available: ${formatCurrency(account.balance.available)}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default Account;

import { eczar } from "@/theme/theme";
import { Box, Divider, Typography, useTheme } from "@mui/material";

const PaymentScheduleSummary = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        borderRadius: "32px",
        padding: "32px",
        backgroundColor: theme.palette.primary.main,
        color: "white",
      }}
    >
      <Typography
        sx={{
          marginBottom: "16px",
          fontSize: "24px",
          fontFamily: eczar.style.fontFamily,
          fontWeight: "500",
        }}
      >
        Payment Schedule
      </Typography>
      <Divider
        sx={{
          height: "2px",
          borderRadius: "8px",
          width: "70%",
          backgroundColor: "white",
        }}
      />
    </Box>
  );
};

export default PaymentScheduleSummary;

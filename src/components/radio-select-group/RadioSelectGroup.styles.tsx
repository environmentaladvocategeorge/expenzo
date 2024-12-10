import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const RadioSelectGroupContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginTop: "16px",
});

export const ErrorText = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.error.main,
  marginTop: "4px",
}));

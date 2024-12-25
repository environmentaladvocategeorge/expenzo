import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  TextField as MUITextField,
  Typography,
  Alert as MUIAlert,
  CircularProgress,
} from "@mui/material";

export const ModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: theme.palette.neutral.white,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
  outline: "none",
}));

export const Alert = styled(MUIAlert)({
  marginBottom: 16,
});

export const ModalTitle = styled(Typography)({
  marginBottom: 16,
});

export const TextField = styled(MUITextField)({
  marginBottom: 16,
});

export const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const CloseButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.primary.main,
}));

export const ForgotPasswordButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.primary.main,
}));

export const LoadingIndicator = styled(CircularProgress)(() => ({
  color: "white",
}));

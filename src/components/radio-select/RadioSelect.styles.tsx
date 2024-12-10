import { styled } from "@mui/material/styles";
import { Box, Radio as MUIRadio, Typography } from "@mui/material";

export const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2, 1),
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  border: `1px solid ${theme.palette.primary.main}`,
  margin: theme.spacing(1, 0),
  cursor: "pointer",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
}));

export const SelectedContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
}));

export const ErrorContainer = styled(Container)(({ theme }) => ({
  border: `1px solid ${theme.palette.error.main}`,
}));

export const LabelWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const Radio = styled(MUIRadio)(({ theme }) => ({
  cursor: "pointer",
}));

export const Label = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
}));

export const Description = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 400,
  color: theme.palette.neutral.gray,
  marginLeft: theme.spacing(6.25),
  marginRight: theme.spacing(1),
  marginTop: theme.spacing(-1),
}));

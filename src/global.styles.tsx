import { Box, Divider, styled, Typography } from "@mui/material";

export const AppHeaderText = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: "24px",
  color: "black",
  textAlign: "center",
  flexGrow: 1,
}));

interface LinkProps {
  isActive?: boolean;
}

export const Link = styled("span", {
  shouldForwardProp: (prop) => prop !== "isActive",
})<LinkProps>(({ theme, isActive }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  transition: "background-color 0.3s, color 0.3s",
  display: "inline-flex",
  alignItems: "center",
  fontWeight: 500,
  color: isActive ? theme.palette.neutral.darkGray : theme.palette.neutral.gray,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.neutral.white,
  },
}));

export const PageContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  margin: "0 auto",
  backgroundColor: theme.palette.neutral.lightGray,
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  transition: "margin-left 0.3s ease-in-out",
}));

export const GridPageContainer = styled(Box)({
  display: "grid",
  gridTemplateRows: "1fr auto",
  height: "100vh",
  gap: "16px",
  padding: "16px",
});

export const WhiteDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.neutral.white,
}));

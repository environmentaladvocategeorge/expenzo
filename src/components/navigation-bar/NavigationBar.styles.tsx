import { AppBar, Box, styled } from "@mui/material";

export const NavigationBarContainer = styled(AppBar)(({ theme }) => ({
  width: "100%",
  height: "82px",
  position: "relative",
  padding: `0 ${theme.spacing(4)}`,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: theme.palette.primary.main,
}));

export const RoutesMenu = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "82px",
  right: 0,
  width: "100%",
  backgroundColor: theme.palette.primary.dark,
  padding: theme.spacing(1),
  borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
  boxShadow: theme.shadows[2],
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
}));

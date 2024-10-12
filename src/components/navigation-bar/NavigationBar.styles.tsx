import { AppBar, styled } from "@mui/material";

export const NavigationBarContainer = styled(AppBar)(({ theme }) => ({
  width: "100%",
  height: "82px",
  position: "relative",
  paddingLeft: theme.spacing(4),
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: theme.palette.primary.main,
}));

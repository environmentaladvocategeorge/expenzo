import { Box, styled } from "@mui/material";

const PageContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: "calc(100vh - 82px)",
  padding: theme.spacing(4),
  margin: "0 auto",
  backgroundColor: theme.palette.neutral.white,
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
}));

export const Link = styled("span")(({ theme }) => ({
  textDecoration: "none",
  padding: theme.spacing(1, 2),
  borderRadius: "4px",
  transition: "background-color 0.3s",
  display: "inline-flex",
  alignItems: "center",

  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export default PageContainer;

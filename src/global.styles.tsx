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

export default PageContainer;

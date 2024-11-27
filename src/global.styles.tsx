import { Box, styled } from "@mui/material";

const PageContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  margin: "0 auto",
  backgroundColor: theme.palette.neutral.white,
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  transition: "margin-left 0.3s ease-in-out",
}));

interface LinkProps {
  isActive?: boolean;
}

export const Link = styled("span", {
  shouldForwardProp: (prop) => prop !== "isActive",
})<LinkProps>(({ theme, isActive }) => ({
  padding: theme.spacing(2),
  borderRadius: "4px",
  transition: "background-color 0.3s, color 0.3s",
  display: "inline-flex",
  alignItems: "center",
  color: isActive ? theme.palette.primary.main : theme.palette.neutral.gray,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.neutral.white,
  },
}));

export default PageContainer;

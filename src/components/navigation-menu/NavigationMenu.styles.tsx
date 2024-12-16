import { styled } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import NextLink from "next/link";

interface NavigationMenuContainerProps extends BoxProps {
  isOpen: boolean;
}

export const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  color: theme.palette.neutral.gray,
  padding: theme.spacing(2),
}));

export const NavigationMenuContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isOpen",
})<NavigationMenuContainerProps>(({ theme, isOpen }) => ({
  backgroundColor: theme.palette.neutral.lightGray,
  height: "100%",
  width: isOpen ? 248 : 88,
  gap: theme.spacing(1),
  transition: "width 0.3s ease-in-out",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  justifyContent: "space-between",
  borderRight: "2px solid #e7e8e8",
  zIndex: 1299,
}));

interface StyledNextLinkProps {
  isActive: boolean;
  isOpen: boolean;
}

export const NavigationLink = styled(NextLink, {
  shouldForwardProp: (prop) => prop !== "isActive" && prop !== "isOpen",
})<StyledNextLinkProps>(({ theme, isActive, isOpen }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  transition: "background-color 0.3s, color 0.3s, justify-content 0.3s",
  justifyContent: isOpen ? "flex-start" : "center",
  color: isActive ? theme.palette.primary.main : theme.palette.neutral.gray,
  marginBottom: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.neutral.white,
  },
}));

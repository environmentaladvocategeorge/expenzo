import { styled } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";

interface NavigationMenuContainerProps extends BoxProps {
  isOpen: boolean;
}

export const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  padding: theme.spacing(2),
  color: theme.palette.neutral.white,
}));

export const NavigationMenuContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isOpen",
})<NavigationMenuContainerProps>(({ theme, isOpen }) => ({
  backgroundColor: theme.palette.neutral.black,
  height: "100%",
  width: isOpen ? 250 : 0,
  transition: "width 0.3s ease-in-out",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  color: theme.palette.neutral.white,
  justifyContent: "space-between",
}));

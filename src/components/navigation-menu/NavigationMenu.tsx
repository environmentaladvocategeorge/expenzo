import * as Styled from "./NavigationMenu.styles";
import { IconButton, Box, Typography, Button } from "@mui/material";
import { ChevronLeft as ChevronLeftIcon } from "@mui/icons-material";
import { AppHeaderText, Link, WhiteDivider } from "@/global.styles";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { useNavigationMenu } from "@/contexts/NavigationMenuContext";
import { useAuth } from "@/contexts/AuthenticationContext";
import LoginModal from "@/modals/LoginModal";
import {
  HomeOutlined,
  WalletOutlined,
  AttachMoneyOutlined,
} from "@mui/icons-material";
import { useState } from "react";

const routes = [
  { label: "Dashboard", path: "/", icon: HomeOutlined },
  { label: "Accounts", path: "/accounts", icon: WalletOutlined },
  { label: "Budgets", path: "/budgets", icon: AttachMoneyOutlined },
];

const NavigationMenu = () => {
  const { isOpen, toggleMenu } = useNavigationMenu();
  const currentPath = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <Styled.NavigationMenuContainer isOpen={isOpen}>
      <Styled.Header>
        <AppHeaderText>expenzo.io</AppHeaderText>
        <IconButton onClick={toggleMenu} color="inherit">
          <ChevronLeftIcon />
        </IconButton>
      </Styled.Header>
      <WhiteDivider />
      <Box sx={{ padding: 2, flexGrow: 1 }}>
        {routes.map(({ label, path, icon: Icon }) => (
          <NextLink href={path} key={label} passHref>
            <Link
              isActive={currentPath === path}
              sx={{ display: "flex", alignItems: "center", mb: 2 }}
            >
              <Icon sx={(theme) => ({ marginRight: theme.spacing(2) })} />
              {isOpen && <Typography variant="body1">{label}</Typography>}
            </Link>
          </NextLink>
        ))}
      </Box>
      <Box
        sx={{
          padding: 2,
        }}
      >
        {isAuthenticated ? (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ textTransform: "none" }}
            onClick={handleLogoutClick}
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ textTransform: "none" }}
            onClick={handleLoginClick}
          >
            Login
          </Button>
        )}
        <LoginModal
          open={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </Box>
    </Styled.NavigationMenuContainer>
  );
};

export default NavigationMenu;

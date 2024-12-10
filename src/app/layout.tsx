"use client";

import { ReactNode } from "react";
import { ThemeProvider, CssBaseline, IconButton, Box } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import {
  NavigationMenuProvider,
  useNavigationMenu,
} from "@/contexts/NavigationMenuContext";
import theme from "@/theme/theme";
import { NavigationMenu } from "@/components";
import { PageContainer } from "@/global.styles";
import { AuthProvider, useAuth } from "@/contexts/AuthenticationContext";
import LoginModal from "@/modals/LoginModal";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <NavigationMenuProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
      </NavigationMenuProvider>
    </AuthProvider>
  );
};

const LayoutContent = ({ children }: { children: ReactNode }) => {
  const { isOpen, toggleMenu } = useNavigationMenu();
  const { showLoginModal, setShowLoginModal } = useAuth();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Climate Data Hub" />
        <title>Expenzo</title>
      </head>
      <body>
        {!isOpen && (
          <IconButton
            onClick={toggleMenu}
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              zIndex: 1000,
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <LoginModal
            open={showLoginModal}
            onClose={() => {
              setShowLoginModal(false);
            }}
          />
          <NavigationMenu />
          <PageContainer>{children}</PageContainer>
        </Box>
      </body>
    </html>
  );
};

export default Layout;

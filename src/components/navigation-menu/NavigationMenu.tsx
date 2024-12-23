import * as Styled from "./NavigationMenu.styles";
import { IconButton, Box, Typography, Button, Tooltip } from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  CalendarMonthOutlined as CalendarIcon,
  MenuOutlined as MenuOutlinedIcon,
} from "@mui/icons-material";
import { AppHeaderText } from "@/global.styles";
import { usePathname } from "next/navigation";
import { useNavigationMenu } from "@/contexts/NavigationMenuContext";
import { useAuth } from "@/contexts/AuthenticationContext";

import {
  HomeOutlined,
  WalletOutlined,
  AttachMoneyOutlined,
  ReceiptOutlined,
} from "@mui/icons-material";

const routes = [
  { label: "Dashboard", path: "/", icon: HomeOutlined },
  { label: "Transactions", path: "/transactions", icon: ReceiptOutlined },
  { label: "Accounts", path: "/accounts", icon: WalletOutlined },
  { label: "Budgets", path: "/budgets", icon: AttachMoneyOutlined },
  {
    label: "Scheduler",
    path: "/scheduler",
    icon: CalendarIcon,
  },
];

const NavigationMenu = () => {
  const { isOpen, toggleMenu } = useNavigationMenu();
  const currentPath = usePathname();
  const { isAuthenticated, logout, setShowLoginModal } = useAuth();

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <Styled.NavigationMenuContainer isOpen={isOpen}>
      <Styled.Header>
        {isOpen ? (
          <>
            <AppHeaderText>expenzo.io</AppHeaderText>
            <Tooltip title={`Collapse Menu`} arrow placement="right">
              <IconButton onClick={toggleMenu} color="inherit">
                <ChevronLeftIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title={"Open Menu"} arrow placement="right">
            <IconButton onClick={toggleMenu} color="inherit">
              <MenuOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </Styled.Header>
      <Box
        sx={{
          padding: 2,
          height: "100%",
          width: "100%",
        }}
      >
        {routes.map(({ label, path, icon: Icon }) => (
          <Tooltip title={`Go to ${label}`} arrow placement="right" key={label}>
            <Styled.NavigationLink
              href={path}
              passHref
              isActive={currentPath == path}
              isOpen={isOpen}
            >
              <>
                <Icon
                  sx={{
                    marginRight: isOpen ? (theme) => theme.spacing(2) : 0,
                  }}
                />
                {isOpen && <Typography variant="body1">{label}</Typography>}
              </>
            </Styled.NavigationLink>
          </Tooltip>
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
      </Box>
    </Styled.NavigationMenuContainer>
  );
};

export default NavigationMenu;

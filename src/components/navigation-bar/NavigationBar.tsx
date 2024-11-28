import * as Styled from "./NavigationBar.styled";
import { IconButton, Box, Typography } from "@mui/material";
import { ChevronLeft as ChevronLeftIcon } from "@mui/icons-material";
import { AppHeaderText, Link, WhiteDivider } from "@/global.styles";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { useNavigationMenu } from "@/contexts/NavigationMenuContext";
import {
  HomeOutlined,
  WalletOutlined,
  AttachMoneyOutlined,
} from "@mui/icons-material";

const routes = [
  { label: "Dashboard", path: "/", icon: HomeOutlined },
  { label: "Accounts", path: "/accounts", icon: WalletOutlined },
  { label: "Budgets", path: "/budgets", icon: AttachMoneyOutlined },
];

const NavigationBar = () => {
  const { isOpen, toggleMenu } = useNavigationMenu();
  const currentPath = usePathname();

  return (
    <Styled.NavigationMenuContainer isOpen={isOpen}>
      <Styled.Header>
        <AppHeaderText>expenzo.io</AppHeaderText>
        <IconButton onClick={toggleMenu} color="inherit">
          <ChevronLeftIcon />
        </IconButton>
      </Styled.Header>
      <WhiteDivider />
      <Box sx={{ padding: 2 }}>
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
    </Styled.NavigationMenuContainer>
  );
};

export default NavigationBar;

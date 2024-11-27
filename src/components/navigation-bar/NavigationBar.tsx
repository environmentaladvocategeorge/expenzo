import { Typography, useTheme, IconButton, Box, Divider } from "@mui/material";
import { ChevronLeft as ChevronLeftIcon } from "@mui/icons-material";
import { Link } from "@/global.styles";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { useNavigationMenu } from "@/contexts/NavigationMenuContext";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WalletOutlinedIcon from "@mui/icons-material/WalletOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";

const routes = [
  { label: "Dashboard", path: "/", icon: HomeOutlinedIcon },
  { label: "Accounts", path: "/accounts", icon: WalletOutlinedIcon },
  { label: "Budgets", path: "/budgets", icon: AttachMoneyOutlinedIcon },
];

const NavigationBar = () => {
  const theme = useTheme();
  const { isOpen, toggleMenu } = useNavigationMenu();
  const currentPath = usePathname();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.neutral.black,
        height: "100%",
        width: isOpen ? 250 : 0,
        transition: "width 0.3s ease-in-out",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: theme.palette.neutral.white,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: "700",
            fontSize: "24px",
            color: theme.palette.neutral.white,
            textAlign: "center",
            flexGrow: 1,
          }}
        >
          savingtree.io
        </Typography>
        <IconButton
          onClick={toggleMenu}
          sx={{
            color: theme.palette.neutral.white,
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider sx={{ backgroundColor: theme.palette.neutral.white }} />
      <Box sx={{ padding: 2 }}>
        {routes.map(({ label, path, icon: Icon }) => {
          return (
            <NextLink href={path} key={label} passHref>
              <Link
                isActive={currentPath === path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <Icon sx={{ marginRight: theme.spacing(2) }} />
                {isOpen && <Typography variant="body1">{label}</Typography>}
              </Link>
            </NextLink>
          );
        })}
      </Box>
    </Box>
  );
};

export default NavigationBar;

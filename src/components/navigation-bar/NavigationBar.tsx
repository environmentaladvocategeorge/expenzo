import * as Styled from "./NavigationBar.styles";
import { Typography, useTheme, IconButton, useMediaQuery } from "@mui/material";
import {
  Public as PublicIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Link } from "@/global.styles";
import NextLink from "next/link";
import { useState, useEffect } from "react";

const routes = [
  { label: "Map", path: "/map" },
  { label: "About Us", path: "/about" },
];

const NavigationBar = () => {
  const theme = useTheme();
  const isTabletOrLarger = useMediaQuery(theme.breakpoints.up("tablet"));
  const [showRoutesMenu, setShowRoutesMenu] = useState(false);

  useEffect(() => {
    if (isTabletOrLarger && setShowRoutesMenu) {
      setShowRoutesMenu(false);
    }
  }, [isTabletOrLarger]);

  return (
    <Styled.NavigationBarContainer>
      <NextLink href="/" passHref>
        <Link>
          <PublicIcon
            sx={{
              width: "32px",
              height: "32px",
              color: theme.palette.neutral.white,
            }}
          />
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "24px",
              color: theme.palette.neutral.white,
              marginLeft: theme.spacing(2),
            }}
          >
            EARTH WATCHER
          </Typography>
        </Link>
      </NextLink>

      {isTabletOrLarger ? (
        routes.map((route, index) => (
          <NextLink key={index} href={route.path} passHref>
            <Link sx={{ marginLeft: theme.spacing(2) }}>
              <Typography
                sx={{
                  fontWeight: "400",
                  fontSize: "18px",
                  color: theme.palette.neutral.white,
                }}
              >
                {route.label}
              </Typography>
            </Link>
          </NextLink>
        ))
      ) : (
        <>
          <IconButton
            onClick={() => setShowRoutesMenu((prev) => !prev)}
            sx={{ marginLeft: "auto", color: theme.palette.neutral.white }}
          >
            {showRoutesMenu ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          {showRoutesMenu && (
            <Styled.RoutesMenu>
              {routes.map((route, index) => (
                <NextLink key={index} href={route.path} passHref>
                  <Link sx={{ marginLeft: theme.spacing(2) }}>
                    <Typography
                      sx={{
                        fontWeight: "400",
                        fontSize: "18px",
                        color: theme.palette.neutral.white,
                      }}
                    >
                      {route.label}
                    </Typography>
                  </Link>
                </NextLink>
              ))}
            </Styled.RoutesMenu>
          )}
        </>
      )}
    </Styled.NavigationBarContainer>
  );
};

export default NavigationBar;

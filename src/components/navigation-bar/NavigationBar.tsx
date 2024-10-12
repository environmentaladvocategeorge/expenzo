import * as Styled from "./NavigationBar.styles";
import { Typography, useTheme } from "@mui/material";
import { Public as PublicIcon } from "@mui/icons-material";
import { Link } from "@/global.styles";
import NextLink from "next/link";

const routes = [
  { label: "Map", path: "/map" },
  { label: "About Us", path: "/about" },
];

const NavigationBar = () => {
  const theme = useTheme();

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
    </Styled.NavigationBarContainer>
  );
};

export default NavigationBar;

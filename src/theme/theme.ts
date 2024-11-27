import { createTheme } from "@mui/material/styles";
import { DM_Sans } from "next/font/google";
import { CssBaseline } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: {
      white: string;
      gray: string;
      black: string;
    };
  }

  interface PaletteOptions {
    neutral: {
      white: string;
      gray: string;
      black: string;
    };
  }

  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true;
    tablet: true;
    laptop: true;
    desktop: true;
  }
}

const dm_sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF7F32",
    },
    secondary: {
      main: "#18b2f2",
    },
    neutral: {
      white: "#FFFFFF",
      gray: "#a6a6a6",
      black: "#191919",
    },
  },
  typography: {
    fontFamily: dm_sans.style.fontFamily,
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    body1: {
      fontSize: "16px",
      fontWeight: 400,
    },
  },
  shadows: Array(25).fill("none") as any,
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 600,
      laptop: 1024,
      desktop: 1440,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        a: {
          textDecoration: "none",
        },
      },
    },
  },
});

export default theme;

import { createTheme } from "@mui/material/styles";
import { Poppins } from "next/font/google";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: {
      white: string;
      lightGray: string;
      gray: string;
      black: string;
    };
  }

  interface PaletteOptions {
    neutral: {
      white: string;
      lightGray: string;
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

const poppins = Poppins({
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
      white: "#ffffff",
      lightGray: "#f4f6f6",
      gray: "#a6a6a6",
      black: "#191919",
    },
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
    allVariants: {
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
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#ffffff",
        },
      },
    },
  },
});

export default theme;

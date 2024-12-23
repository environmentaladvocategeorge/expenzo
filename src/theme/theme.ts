import { createTheme } from "@mui/material/styles";
import { Eczar, Inter } from "next/font/google";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: {
      white: string;
      lightGray: string;
      gray: string;
      darkGray: string;
      black: string;
    };
  }

  interface PaletteOptions {
    neutral: {
      white: string;
      lightGray: string;
      gray: string;
      darkGray: string;
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

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const eczar = Eczar({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#8b7ce3",
      light: "#c2baf5",
      dark: "#4838a8",
    },
    secondary: {
      main: "#5845d1",
    },
    neutral: {
      white: "#ffffff",
      lightGray: "#f8f6ff",
      gray: "#75746d",
      darkGray: "#434646",
      black: "#191919",
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
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
          color: "#fafafa",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#8b7ce3",
        },
        arrow: {
          color: "#8b7ce3",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderColor: "#8b7ce3",
          },
          "&:hover fieldset": {
            borderColor: "#4838a8 !important",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#8b7ce3",
          },
        },
      },
    },
  },
});

export default theme;

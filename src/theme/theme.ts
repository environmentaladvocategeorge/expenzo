import { createTheme } from "@mui/material/styles";
import { Poppins, Eczar } from "next/font/google";

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

export const poppins = Poppins({
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
      main: "#759be6",
      light: "#78a3fa",
      dark: "#234da1",
    },
    secondary: {
      main: "#367dcf",
    },
    neutral: {
      white: "#ffffff",
      lightGray: "#fcfdff",
      gray: "#4c4b47",
      darkGray: "#434646",
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
          color: "#fafafa",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#759be6",
        },
        arrow: {
          color: "#759be6",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderColor: "#759be6",
          },
          "&:hover fieldset": {
            borderColor: "#78a3fa !important",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#759be6",
          },
        },
      },
    },
  },
});

export default theme;

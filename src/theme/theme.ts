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
      main: "#8fad86",
      light: "#f5faf5",
      dark: "#6c8b67",
    },
    secondary: {
      main: "#18b2f2",
    },
    neutral: {
      white: "#f4f4f4",
      lightGray: "#f4f6f4",
      gray: "#a6a6a6",
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
          backgroundColor: "#8fad86",
        },
        arrow: {
          color: "#8fad86",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderColor: "#8fad86",
          },
          "&:hover fieldset": {
            borderColor: "#6c8b67 !important",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#8fad86",
          },
        },
      },
    },
  },
});

export default theme;

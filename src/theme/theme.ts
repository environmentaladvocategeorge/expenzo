import { createTheme } from "@mui/material/styles";
import { Fira_Sans } from "next/font/google";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: {
      white: string;
    };
  }

  interface PaletteOptions {
    neutral: {
      white: string;
    };
  }
}

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#455a64",
      light: "#6a7b83",
      dark: "#303e46",
    },
    secondary: {
      main: "#546e7a",
      light: "#768b94",
      dark: "#3a4d55",
    },
    neutral: {
      white: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: firaSans.style.fontFamily,
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    body1: {
      fontSize: "18px",
      fontWeight: 400,
    },
  },
  shadows: Array(25).fill("none") as any,
});

export default theme;

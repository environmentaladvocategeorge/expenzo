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
      main: "#4CAF50",
      light: "#C8E6C9",
      dark: "#1B5E20",
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
      fontWeight: 400,
    },
  },
  shadows: Array(25).fill("none") as any,
});

export default theme;

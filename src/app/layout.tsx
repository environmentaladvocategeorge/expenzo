"use client";

import { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/theme/theme";
import { NavigationBar } from "@/components";
import PageContainer from "@/global.styles";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Climate Data Hub" />
        <title>Earth Watcher</title>
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavigationBar />
          <PageContainer>{children}</PageContainer>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;

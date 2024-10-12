import * as Styled from "./NavigationBar.styles";
import { Typography, useTheme } from "@mui/material";
import { Public as PublicIcon } from "@mui/icons-material";

const NavigationBar = () => {
  const theme = useTheme();
  return (
    <Styled.NavigationBarContainer>
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
    </Styled.NavigationBarContainer>
  );
};

export default NavigationBar;

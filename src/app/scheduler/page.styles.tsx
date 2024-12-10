import { styled } from "@mui/material/styles";
import { Box, Button, Typography, Stepper } from "@mui/material";
import { darken } from "@mui/material";
import { DragIndicator as DragIndicatorIcon } from "@mui/icons-material";
import { eczar } from "@/theme/theme";

export const PanelResizeHandleContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "10px",
  backgroundColor: theme.palette.primary.main,
  cursor: "col-resize",
  marginLeft: "8px",
  marginRight: "8px",
  borderRadius: "8px",
  transition: "background-color 0.3s ease",
  height: "100%",
  "&:hover": {
    backgroundColor: darken(theme.palette.primary.main, 0.1),
  },
}));

export const DragIndicatorStyledIcon = styled(DragIndicatorIcon)({
  color: "white",
  fontSize: "16px",
});

export const StepperContainer = styled(Box)({
  width: "100%",
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  borderRadius: "32px",
});

export const StepperButton = styled(Button)({
  marginRight: "8px",
});

export const StepperNextButton = styled(Button)({
  marginLeft: "8px",
});

export const StepLabelText = styled(Typography)({
  fontFamily: eczar.style.fontFamily,
  fontWeight: "500",
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
  maxWidth: "calc(100% - 20px)",
});

export const StepperStyled = styled(Stepper)({
  width: "100%",
});

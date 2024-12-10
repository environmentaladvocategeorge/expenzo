import { Box, useTheme } from "@mui/material";
import CashFlowInFormSection from "./CashFlowInFormSection";

interface PaymentSchedulerFormProps {
  currentStep: number;
}

const PaymentSchedulerForm: React.FC<PaymentSchedulerFormProps> = ({
  currentStep,
}) => {
  const renderFormSection = () => {
    switch (currentStep) {
      case 0:
        return <CashFlowInFormSection />;
      case 1:
        return <div></div>;
      case 2:
        return <div></div>;
      case 3:
        return <div></div>;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        padding: "32px",
        borderRadius: "16px",
        backgroundColor: "white",
      }}
    >
      {renderFormSection()}
    </Box>
  );
};

export default PaymentSchedulerForm;

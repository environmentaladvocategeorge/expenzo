import { eczar } from "@/theme/theme";
import { Divider, Typography, useTheme } from "@mui/material";
import { RadioSelectGroup } from "@/components";
import { useFormContext } from "react-hook-form";

const CashFlowInFormSection = () => {
  const theme = useTheme();
  const { control } = useFormContext();
  return (
    <>
      <Typography
        variant="h4"
        sx={{
          marginBottom: "16px",
          fontFamily: eczar.style.fontFamily,
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        {"Let's calculate your cash flow in."}
      </Typography>
      <Divider
        sx={{
          height: "2px",
          borderRadius: "8px",
          backgroundColor: theme.palette.primary.main,
          marginBottom: "16px",
        }}
      />
      <Typography
        sx={{ fontSize: "18px", fontWeight: 500, marginBottom: "8px" }}
      >
        How often do you get paid?
      </Typography>
      <RadioSelectGroup
        name="cashFlowIn.paymentCadence"
        control={control}
        values={[
          {
            label: "Bi-Weekly",
            value: "biweekly",
            description:
              "Paid every two weeks, typically on a fixed day like every other Friday. Common for full-time employees in retail or construction.",
          },
          {
            label: "Semi-Monthly",
            value: "semimonthly",
            description:
              "Paid twice a month, usually on fixed dates like the 15th and last day. Common for salaried employees in office-based jobs.",
          },
          {
            label: "Weekly",
            value: "weekly",
            description:
              "Paid every week, typically on a set day like every Friday. Common for hourly employees in hospitality or gig work.",
          },
          {
            label: "Monthly",
            value: "monthly",
            description:
              "Paid once a month, often at the end or start of the month. Typical for salaried positions in professional roles.",
          },
          {
            label: "Occasional Payments",
            value: "occasional",
            description:
              "Paid a few times a year, like for special contracts or bonuses. Applies to freelancers, contractors, or commission roles.",
          },
          {
            label: "Other",
            value: "other",
            description:
              "If your pay schedule is unique, select this option for further help.",
          },
        ]}
        isRequired
      />
    </>
  );
};

export default CashFlowInFormSection;

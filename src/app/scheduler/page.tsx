"use client";

import * as Styled from "./page.styles";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import PaymentScheduleSummary from "./_components/PaymentScheduleSummary";
import { PaymentSchedulerForm } from "@/types/payment-scheduler-form";
import { GridPageContainer } from "@/global.styles";

const steps = ["Cash Flow In", "Payments", "Cash Flow Out", "Review"];

const Scheduler = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm<PaymentSchedulerForm>({
    defaultValues: {
      cashFlowIn: {
        paymentCadence: "",
      },
      payments: {},
      cashFlowOut: {},
      review: {},
    },
    mode: "onChange",
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = methods.handleSubmit((data) => {
    console.log("Form submitted:", data);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} style={{ height: "100vh" }}>
        <GridPageContainer>
          <PanelGroup direction="horizontal" autoSaveId="scheduler-layout">
            <Panel defaultSize={80} minSize={50}>
              <PaymentSchedulerForm currentStep={currentStep} />
            </Panel>
            <PanelResizeHandle>
              <Styled.PanelResizeHandleContainer>
                <Styled.DragIndicatorStyledIcon />
              </Styled.PanelResizeHandleContainer>
            </PanelResizeHandle>
            <Panel minSize={20}>
              <PaymentScheduleSummary />
            </Panel>
          </PanelGroup>
          <Styled.StepperContainer>
            <Styled.StepperButton
              disabled={currentStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Styled.StepperButton>
            <Styled.StepperStyled activeStep={currentStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>
                    <Styled.StepLabelText>{label}</Styled.StepLabelText>
                  </StepLabel>
                </Step>
              ))}
            </Styled.StepperStyled>
            <Styled.StepperNextButton
              onClick={
                currentStep === steps.length - 1 ? handleSubmit : handleNext
              }
              variant="contained"
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </Styled.StepperNextButton>
          </Styled.StepperContainer>
        </GridPageContainer>
      </form>
    </FormProvider>
  );
};

export default Scheduler;

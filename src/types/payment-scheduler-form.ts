export interface PaymentSchedulerForm {
  cashFlowIn: {
    paymentCadence: string;
  };
  payments: object;
  cashFlowOut: object;
  review: object;
}

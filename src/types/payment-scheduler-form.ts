export interface PaymentSchedulerFormType {
  cashFlowIn: {
    paymentCadence: string;
  };
  payments: object;
  cashFlowOut: object;
  review: object;
}

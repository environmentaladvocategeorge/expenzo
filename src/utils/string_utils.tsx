export const formatCurrency = (amount: number | undefined) => {
  return amount
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    : "$0.00";
};

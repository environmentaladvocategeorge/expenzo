export interface Account {
  enrollmentId: string;
  links: {
    balances: string;
    self: string;
    transactions: string;
  };
  institution: {
    name: string;
    id: string;
  };
  type: string;
  name: string;
  subtype: string;
  currency: string;
  id: string;
  last_four: string;
  status: string;
}

export interface GetAccountsResponse {
  accounts: Account[];
}

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

export interface AccountCreateRequest {
  provider: string;
  provider_id: string;
  entity_data: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface GetAccountsResponse {
  accounts: Account[];
}

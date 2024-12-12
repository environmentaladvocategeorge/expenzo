export interface Institution {
  name: string;
  id: string;
}

export interface AccountBalance {
  ledger: string;
  account_id: string;
  available: string;
}

export interface AccountDetails {
  enrollmentId: string;
  institution: Institution;
  type: string;
  name: string;
  subtype: string;
  currency: string;
  id: string;
  last_four: string;
  status: string;
  links?: {
    balances?: string;
    self?: string;
    transactions?: string;
  };
}

export interface Account {
  details: AccountDetails;
  balance: AccountBalance;
}

export interface AccountCreateRequest {
  provider: string;
  provider_id: string;
  entity_data: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface GetAccountsResponse {
  debit: Account[];
  credit: Account[];
}

export interface AccountCreateRequest {
  provider: string;
  provider_id: string;
  entity_data: Record<string, string>;
  metadata?: Record<string, any>;
}

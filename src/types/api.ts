export interface Institution {
  name: string;
  id: string;
}

export interface AccountBalance {
  ledger: number;
  account_id: string;
  available: number;
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
  debit: { total_ledger: number; total_available: number; accounts: Account[] };
  credit: {
    total_ledger: number;
    total_available: number;
    accounts: Account[];
  };
}

export interface AccountCreateRequest {
  provider: string;
  provider_id: string;
  entity_data: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface TransactionDetails {
  processing_status: string;
  category?: string;
}

export interface Transaction {
  details: TransactionDetails;
  running_balance?: number;
  description: string;
  id: string;
  date: string;
  account_id: string;
  amount: number;
  type: string;
  status: string;
}

export interface GetTransactionsResponse {
  transactions: Transaction[];
}

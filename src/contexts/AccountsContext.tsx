import React, { createContext, useState, useEffect, useContext } from "react";
import { GetAccountsResponse, Account } from "@/types/api";
import { fetchAccounts } from "@/services/accountService";
import { useAuth } from "@/contexts/AuthenticationContext";

interface AccountsContextProps {
  accounts: GetAccountsResponse | null;
  accountsLoading: boolean;
  refreshAccounts: () => Promise<void>;
  getAccountById: (account_id: string) => Account | null;
}

const AccountsContext = createContext<AccountsContextProps | undefined>(
  undefined
);

interface AccountsProviderProps {
  children: React.ReactElement | React.ReactElement[];
}

export const AccountsProvider = ({ children }: AccountsProviderProps) => {
  const { isAuthenticated, getToken } = useAuth();
  const [accounts, setAccounts] = useState<GetAccountsResponse | null>(null);
  const [accountsLoading, setAccountsLoading] = useState<boolean>(true);

  const fetchAndSetAccounts = async () => {
    if (!isAuthenticated) {
      setAccounts(null);
      setAccountsLoading(false);
      return;
    }

    setAccountsLoading(true);
    try {
      const accountsData = await fetchAccounts(getToken);
      setAccounts(accountsData);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setAccountsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetAccounts();
  }, [isAuthenticated]);

  const getAccountById = (account_id: string): Account | null => {
    if (!accounts) {
      return null;
    }
    const allAccounts = [
      ...accounts.debit.accounts,
      ...accounts.credit.accounts,
    ];
    return (
      allAccounts.find((account) => account.details.id === account_id) || null
    );
  };

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        accountsLoading,
        refreshAccounts: fetchAndSetAccounts,
        getAccountById,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = (): AccountsContextProps => {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error("useAccounts must be used within an AccountsProvider");
  }
  return context;
};

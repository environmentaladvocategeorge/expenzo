"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { GetTransactionsResponse } from "@/types/api";
import { useAuth } from "@/contexts/AuthenticationContext";
import { fetchTransactions } from "@/services/transactionService";

interface TransactionsContextType {
  transactions: GetTransactionsResponse | null;
  transactionsLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  paginatedTransactions: GetTransactionsResponse["transactions"];
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

interface TransactionsProviderProps {
  children: React.ReactElement | React.ReactElement[];
}

export const TransactionsProvider = ({
  children,
}: TransactionsProviderProps) => {
  const { isAuthenticated, setShowLoginModal, getToken } = useAuth();
  const [transactions, setTransactions] =
    useState<GetTransactionsResponse | null>(null);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = transactions
    ? Math.ceil(transactions.transactions.length / itemsPerPage)
    : 1;

  useEffect(() => {
    const handleAuthentication = async () => {
      if (!isAuthenticated) {
        setShowLoginModal(true);
        setTransactionsLoading(false);
        return;
      }

      try {
        setTransactionsLoading(true);
        const transactionsData = await fetchTransactions(getToken);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setTransactionsLoading(false);
      }
    };

    handleAuthentication();
  }, [isAuthenticated]);

  const paginatedTransactions =
    transactions?.transactions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        transactionsLoading,
        currentPage,
        itemsPerPage,
        setCurrentPage,
        totalPages,
        paginatedTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider"
    );
  }
  return context;
};

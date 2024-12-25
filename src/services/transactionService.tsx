import apiClient from "@/lib/apiClient";
import { GetTransactionsResponse } from "../types/api";

const client = apiClient();

export const fetchTransactions = async (
  getToken: () => string | null
): Promise<GetTransactionsResponse> => {
  const token = getToken();
  const response = await client.get<GetTransactionsResponse>(`/transactions`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return response.data;
};

export const updateTransaction = async (
  getToken: () => string | null,
  transactionId: string
): Promise<GetTransactionsResponse> => {
  const token = getToken();
  const response = await client.put<any>(
    `/transactions/${transactionId}`,
    {
      details: { category: "transfer" },
    },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );
  return response.data;
};

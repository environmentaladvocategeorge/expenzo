import apiClient from "@/lib/apiClient";
import { GetTransactionsResponse } from "../types/api";

const client = apiClient();

const retryOnce = async <T,>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.warn("Initial API call failed, retrying...", error);
    return await fn();
  }
};

export const fetchTransactions = async (
  getToken: () => string | null
): Promise<GetTransactionsResponse> => {
  const token = getToken();
  const makeRequest = async () => {
    const response = await client.get<GetTransactionsResponse>(
      `/transactions`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );
    return response.data;
  };

  return await retryOnce(makeRequest);
};

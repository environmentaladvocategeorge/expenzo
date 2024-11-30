import apiClient from "@/lib/apiClient";
import { GetAccountsResponse } from "../types/api";

const client = apiClient();

export const fetchAccounts = async (
  getAccessToken: () => string | null
): Promise<GetAccountsResponse> => {
  const token = getAccessToken();
  const response = await client.get<GetAccountsResponse>("/accounts", {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return response.data;
};

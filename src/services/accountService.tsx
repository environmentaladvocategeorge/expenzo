import apiClient from "@/lib/apiClient";
import { GetAccountsResponse } from "../types/api";

const client = apiClient();

export const fetchAccounts = async (
  getToken: () => string | null
): Promise<GetAccountsResponse> => {
  const token = getToken();
  const response = await client.get<GetAccountsResponse>(`/accounts`, {
    params: {
      access_token: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
    },
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return response.data;
};

export const createAccount = async (
  accountRequest: any,
  getToken: () => string | null
): Promise<any> => {
  const token = getToken();
  const response = await client.post<any>("/accounts", accountRequest, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  return response.data;
};

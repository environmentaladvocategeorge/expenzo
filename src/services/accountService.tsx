import apiClient from "@/lib/apiClient";
import { GetAccountsResponse } from "../types/api";

export const fetchAccounts = async (): Promise<GetAccountsResponse> => {
  const response = await apiClient.get<GetAccountsResponse>("/accounts");
  return response.data;
};

import apiClient from "@/lib/apiClient";
import { GetAccountsResponse } from "../types/api";

const client = apiClient();

export const fetchAccounts = async (
  getToken: () => string | null
): Promise<GetAccountsResponse> => {
  const token = getToken();
  const response = await client.get<GetAccountsResponse>(
    `/accounts?accessToken=${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );
  return response.data;
};

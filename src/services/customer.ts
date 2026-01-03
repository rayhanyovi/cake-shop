import apiClient, { type ApiSuccess } from "../lib/apiClient";

export type CustomerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
};

export const getCustomerProfile = async (accessToken?: string) => {
  const response = await apiClient.get<ApiSuccess<CustomerProfile>>(
    "/api/customer",
    accessToken ? { headers: { Authorization: accessToken } } : undefined,
  );

  return response.data;
};

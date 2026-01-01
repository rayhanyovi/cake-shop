import apiClient, { ApiSuccess } from "../lib/apiClient";

export type AuthToken = {
  accessToken: string;
  expiresAt: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const register = async (payload: RegisterPayload) => {
  const response = await apiClient.post<ApiSuccess<AuthToken>>(
    "/api/register",
    payload,
    {
      baseURL: "",
    }
  );
  return response.data;
};

export const login = async (payload: LoginPayload) => {
  const response = await apiClient.post<ApiSuccess<AuthToken>>(
    "/api/login",
    payload,
    {
      baseURL: "",
    }
  );

  console.log("API Response:", response);
  return response.data;
};

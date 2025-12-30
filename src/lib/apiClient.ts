import axios, { type AxiosError, type AxiosResponse } from "axios";

const baseURL = process.env.API_BASE_URL ?? "http://localhost:3000";

export type ApiErrorItem = {
  error: string;
  message: string;
};

export type ApiError = {
  success: false;
  message: string;
  code?: number;
  errors?: ApiErrorItem[];
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export class AuthRedirectError extends Error {
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "AuthRedirectError";
  }
}

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const isLoginRedirect = (response: AxiosResponse) => {
  const responseUrl = response.request?.responseURL;
  if (!responseUrl) {
    return false;
  }

  try {
    const parsed = new URL(responseUrl);
    return parsed.pathname.toLowerCase().includes("/login");
  } catch {
    return responseUrl.toLowerCase().includes("/login");
  }
};

apiClient.interceptors.response.use(
  (response) => {
    if (isLoginRedirect(response)) {
      return Promise.reject(new AuthRedirectError());
    }
    return response;
  },
  (error: AxiosError) => Promise.reject(error)
);

export const getApiError = (error: unknown): ApiError | null => {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const data = error.response?.data;
  if (!data || typeof data !== "object") {
    return null;
  }

  if ("success" in data && data.success === false) {
    return data as ApiError;
  }

  return null;
};

export default apiClient;

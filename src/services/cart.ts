import apiClient, { type ApiSuccess } from "../lib/apiClient";

export type CartAttribute = {
  key: string;
  value: string;
};

export type CartImage = {
  id: string;
  width: number;
  height: number;
  url: string;
};

export type CartMerchandise = {
  id: string;
  availableForSale: boolean;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  product: {
    title: string;
  };
  image: CartImage | null;
};

export type CartLine = {
  id: string;
  quantity: number;
  attributes: CartAttribute[];
  merchandise: CartMerchandise;
};

export type CartCost = {
  subtotalAmount: {
    amount: number;
    currencyCode: string;
  };
};

export type CartData = {
  id: string;
  buyerIdentity: {
    customer: {
      email: string;
      firstName: string;
      lastName: string;
    } | null;
  };
  lines: {
    nodes: CartLine[];
  };
  cost: CartCost;
};

export type CreateCartPayload = {
  variantId: string;
  cakeWording?: string;
  greetingWording?: string;
  quantity: number;
};

export type AddCartLinePayload = {
  cartId: string;
  variantId: string;
  cakeWording?: string;
  greetingWording?: string;
  quantity: number;
};

export type GetCartPayload = {
  cartId: string;
};

export type UpdateCartBuyerIdentityPayload = {
  cartId: string;
};

export type UpdateCartLinePayload = {
  cartId: string;
  lineId: string;
  quantity?: number;
  cakeWording?: string;
  greetingWording?: string;
};

export type CheckoutPayload = {
  phone: string;
  deliveryTime: string;
  deliveryDate: string;
  cartId: string;
};

export type RemoveCartItemPayload = {
  cartId: string;
  lineIds: string;
};

export type CreateCartResponse = ApiSuccess<CartData>;
export type AddCartLineResponse = ApiSuccess<CartData>;
export type GetCartResponse = ApiSuccess<{ cart: CartData }>;
export type UpdateCartBuyerIdentityResponse = ApiSuccess<CartData>;
export type UpdateCartLineResponse = ApiSuccess<{
  cartLinesUpdate: { cart: CartData };
}>;
export type CheckoutResponse = ApiSuccess<{ message: string }>;
export type RemoveCartItemResponse = ApiSuccess<CartData>;

const authHeaders = (accessToken?: string) =>
  accessToken ? { Authorization: accessToken } : undefined;

export const createCart = async (
  payload: CreateCartPayload,
  accessToken?: string
) => {
  const response = await apiClient.post<CreateCartResponse>(
    "/api/createCart",
    payload,
    {
      headers: authHeaders(accessToken),
    }
  );
  return response.data;
};

export const addCartLine = async (
  payload: AddCartLinePayload,
  accessToken?: string
) => {
  const response = await apiClient.post<AddCartLineResponse>(
    "/api/cart-line-add",
    payload,
    {
      headers: authHeaders(accessToken),
    }
  );
  return response.data;
};

export const getCart = async (payload: GetCartPayload) => {
  const response = await apiClient.post<GetCartResponse>(
    "/api/get-cart",
    payload
  );
  return response.data;
};

export const updateCartBuyerIdentity = async (
  payload: UpdateCartBuyerIdentityPayload,
  accessToken?: string
) => {
  const response = await apiClient.post<UpdateCartBuyerIdentityResponse>(
    "/api/update-cart-buyer-identity",
    payload,
    {
      headers: authHeaders(accessToken),
    }
  );
  return response.data;
};

export const updateCartLine = async (payload: UpdateCartLinePayload) => {
  const response = await apiClient.post<UpdateCartLineResponse>(
    "/api/update-cart-line",
    payload
  );
  return response.data;
};

export const checkout = async (
  payload: CheckoutPayload,
  accessToken?: string
) => {
  const response = await apiClient.post<CheckoutResponse>(
    "/api/checkout",
    payload,
    {
      headers: authHeaders(accessToken),
    }
  );
  return response.data;
};

export const removeCartItem = async (payload: RemoveCartItemPayload) => {
  const response = await apiClient.post<RemoveCartItemResponse>(
    "/api/remove-cart-item",
    payload
  );
  return response.data;
};

import apiClient, { type ApiSuccess } from "../lib/apiClient";

export type ProductPrice = {
  amount: string;
  currencyCode: string;
};

export type ProductVariantOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: ProductVariantOption[];
  price: ProductPrice;
};

export type ProductOptionValue = {
  id: string;
  name: string;
};

export type ProductOption = {
  name: string;
  optionValues: ProductOptionValue[];
};

export type ProductImage = {
  id: string;
  width: number;
  height: number;
  url: string;
};

export type ProductDetail = {
  id: string;
  title: string;
  description: string;
  variants: {
    nodes: ProductVariant[];
  };
  options: ProductOption[];
  images: {
    nodes: ProductImage[];
  };
};

export const getProductDetail = async (slug: string) => {
  const response = await apiClient.get<ApiSuccess<ProductDetail>>(
    `/api/product/${encodeURIComponent(slug)}`,
    {
      baseURL: "",
    },
  );
  return response.data;
};

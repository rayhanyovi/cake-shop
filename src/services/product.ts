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

export type ProductListImage = {
  id: string;
  previewImage: ProductImage | null;
};

export type ProductListItem = {
  id: string;
  title: string;
  handle: string;
  isPackaging: boolean;
  metafield: unknown | null;
  isPO: boolean | null;
  priceRange: {
    maxVariantPrice: ProductPrice;
  };
  bestseller: boolean | null;
  seasonal: boolean | null;
  media: {
    nodes: ProductListImage[];
  };
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

export const getAllProducts = async () => {
  const response = await apiClient.get<ApiSuccess<ProductListItem[]>>(
    "/api/all-products"
  );
  return response.data;
};

export const getProductDetail = async (slug: string) => {
  const response = await apiClient.get<ApiSuccess<ProductDetail>>(
    `/api/product/${encodeURIComponent(slug)}`
  );
  return response.data;
};

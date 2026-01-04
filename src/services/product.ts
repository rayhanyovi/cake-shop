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
  bestseller?: boolean | null;
  seasonal?: boolean | null;
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
    "/api/all-products",
    {
      baseURL: "",
    }
  );
  return response.data;
};

const PRODUCT_LIST_TTL_MS = 10 * 60 * 1000;
let productListCache: {
  data: ProductListItem[];
  expiresAt: number;
} | null = null;

export const getAllProductsCached = async () => {
  const now = Date.now();
  if (productListCache && productListCache.expiresAt > now) {
    return { success: true, data: productListCache.data } as ApiSuccess<
      ProductListItem[]
    >;
  }

  const response = await getAllProducts();
  if (Array.isArray(response?.data)) {
    productListCache = {
      data: response.data,
      expiresAt: now + PRODUCT_LIST_TTL_MS,
    };
  }
  return response;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getProductFlagsFromCache = async (slug: string) => {
  const response = await getAllProductsCached();
  const items = Array.isArray(response?.data) ? response.data : [];
  const normalized = slug.trim().toLowerCase();
  const match =
    items.find((item) => item.handle?.trim().toLowerCase() === normalized) ??
    items.find((item) => slugify(item.title) === normalized);

  if (!match) return null;
  return {
    bestseller: match.bestseller ?? null,
    seasonal: match.seasonal ?? null,
  };
};

export const getProductDetail = async (slug: string) => {
  const response = await apiClient.get<ApiSuccess<ProductDetail>>(
    `/api/product/${encodeURIComponent(slug)}`,
    {
      baseURL: "",
    }
  );
  return response.data;
};

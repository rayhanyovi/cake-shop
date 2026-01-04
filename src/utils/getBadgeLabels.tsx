import { ProductCardData } from "../components/ProductCard";
import { ProductListItem } from "../services/product";

export const getBadgeLabels = (product: ProductListItem | ProductCardData) => {
  const labels: string[] = [];
  if (product.bestseller) labels.push("Best Seller");
  if (product.seasonal) labels.push("Seasonal");
  return labels;
};

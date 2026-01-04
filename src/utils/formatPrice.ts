type FormatPriceOptions = {
  currencyCode?: string | null;
  fallback?: string;
};

export const formatPrice = (
  value?: number | string | null,
  options: FormatPriceOptions = {}
) => {
  if (value === undefined || value === null) {
    return options.fallback ?? "";
  }

  const numeric = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numeric)) {
    return options.fallback ?? "";
  }

  const normalized = numeric / 1000;
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(normalized);

  return options.currencyCode ? `${options.currencyCode} ${formatted}` : formatted;
};

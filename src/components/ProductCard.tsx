import Image from "next/image";
import Link from "next/link";
import Ribbon from "./Ribbon";
import { getBadgeLabels } from "../utils/getBadgeLabels";

export type ProductCardMedia = {
  id: string;
  previewImage?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
};

export type ProductCardData = {
  id: string;
  title: string;
  handle: string;
  priceRange?: {
    maxVariantPrice?: {
      amount: string;
      currencyCode?: string | null;
    } | null;
  } | null;
  bestseller?: boolean | null;
  seasonal?: boolean | null;
  media?: {
    nodes?: ProductCardMedia[] | null;
  } | null;
};

type ProductCardProps = {
  product: ProductCardData;
  className?: string;
};

const formatPrice = (amount: string, currencyCode?: string | null) => {
  const numeric = Number(amount);
  const formatted = Number.isFinite(numeric)
    ? new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
        numeric
      )
    : amount;

  return currencyCode ? `${currencyCode} ${formatted}` : formatted;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function ProductCard({ product, className }: ProductCardProps) {
  const badgeLabels = getBadgeLabels(product);
  const media = product.media?.nodes?.[0]?.previewImage ?? null;
  const imageUrl = media?.url ?? "/file.svg";
  const imageAlt = media?.altText ?? product.title;
  const slug = product.handle?.trim() ? product.handle : slugify(product.title);
  const price = formatPrice(
    (
      Number(product.priceRange?.maxVariantPrice?.amount ?? "0") / 1000
    ).toString()
  );

  return (
    <Link href={`/product/${slug}`} className="group block">
      <article
        className={`flex flex-col gap-3 transition duration-200 group-hover:-translate-y-1  ${
          className ?? ""
        }`.trim()}
      >
        <div className="relative aspect-square w-full overflow-visible bg-muted/20">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute right-0 top-4 flex flex-col gap-2 overflow-visible">
            {badgeLabels.map((label, index) => (
              <Ribbon key={index} label={label} />
            ))}
          </div>
        </div>

        <div className="flex flex-row w-full items-center justify-between">
          <p className="text-base font-semibold uppercase tracking-[0.12em] text-foreground flex-wrap">
            {product.title}
          </p>
          <span className="text-xl font-serif text-price">{price}</span>
        </div>
      </article>
    </Link>
  );
}

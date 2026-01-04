import Image from "next/image";
import {
  getProductDetail,
  getProductFlagsFromCache,
  type ProductDetail,
} from "@/src/services/product";
import ProductDetailPanel from "@/src/components/ProductDetailPanel";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const ProductSkeleton = () => (
  <div className="grid min-h-[80vh] w-full grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr]">
    <div className="relative min-h-[60vh] w-full animate-pulse overflow-hidden bg-muted/40" />
    <div className="flex w-full animate-pulse flex-col gap-6 bg-muted/20 p-8">
      <div className="h-4 w-2/3 bg-muted/60" />
      <div className="h-4 w-1/3 bg-muted/60" />
      <div className="h-px w-full bg-muted/50" />
      <div className="h-3 w-3/4 bg-muted/50" />
      <div className="h-3 w-2/3 bg-muted/50" />
      <div className="h-3 w-1/2 bg-muted/50" />
      <div className="h-10 w-full border border-muted/60" />
      <div className="h-10 w-full border border-muted/60" />
      <div className="h-12 w-full border border-muted/60" />
    </div>
  </div>
);

export default async function ProductDetailPage({ params }: ProductPageProps) {
  let product: ProductDetail | null = null;

  try {
    const { slug } = await params;
    const response = await getProductDetail(slug);
    console.log("Fetched product detail for slug:", slug, response.data);

    product = response.data ?? null;
    if (product) {
      const flags = await getProductFlagsFromCache(slug);
      if (flags) {
        product = { ...product, ...flags };
      }
    }
  } catch (error) {
    console.error("Failed to load product detail:", error);
  }

  if (!product) {
    return (
      <main className="min-h-screen w-full px-6 py-12 lg:px-12">
        <ProductSkeleton />
      </main>
    );
  }

  const primaryImage = product.images?.nodes?.[0];
  return (
    <main className="min-h-screen w-full">
      <section className="grid min-h-[100vh] w-full grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="relative min-h-[60vh] w-full overflow-hidden bg-muted/30">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={product.title}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-muted/20 to-transparent" />
          )}
        </div>

        <ProductDetailPanel product={product} />
      </section>
    </main>
  );
}

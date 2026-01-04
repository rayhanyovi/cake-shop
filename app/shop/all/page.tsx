import ProductCard from "@/src/components/ProductCard";
import { getAllProductsCached } from "@/src/services/product";

export default async function ShopAllPage() {
  let products: ProductListItem[] | [] = [];

  try {
    const response = await getAllProductsCached();
    console.log("ShopAllPage products response:", response);
    products = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Failed to load products:", error);
  }

  const hasProducts = products.length > 0;

  return (
    <main className="min-h-screen w-full">
      <section className="mx-auto w-full px-5 lg:px-8 py-5 lg:py-8 ">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold uppercase text-foreground">
            Handcrafted Signature Cakes.
          </h1>
          <p className="text-sm italic text-muted-foreground">
            *All prices shown are in thousands of rupiah
          </p>
        </header>

        {!hasProducts ? (
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p className="font-semibold uppercase tracking-[0.2em] text-foreground/80">
              Nothing on the shelf yet
            </p>
            <p>Our next batch is in the oven. Check back soon.</p>
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

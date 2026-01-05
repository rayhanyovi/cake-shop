import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/src/components/ProductCard";
import { getAllProductsCached, ProductListItem } from "@/src/services/product";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: ProductListItem[] | [] = [];
  let hasError = false;

  try {
    const response = await getAllProductsCached();
    products = Array.isArray(response.data) ? response.data.slice(0, 4) : [];
  } catch (error) {
    hasError = true;
    console.error("Failed to load home products:", error);
  }

  const hasProducts = products.length > 0;

  return (
    <main className="flex w-full flex-col -mt-18.25">
      <section className="relative min-h-screen w-full overflow-hidden">
        <Image
          src="/Hero Banner.png"
          alt="Union Bakery hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative mx-auto flex min-h-screen w-full items-end justify-start px-6 pb-16 text-background lg:justify-end lg:px-64 lg:bg-transparent">
          <p className="max-w-md space-y-4 text-3xl uppercase font-bold z-20 bg-linear-to-t from-slate-800/50 from-0% to-50% to-transparent lg:bg-none">
            Handcrafted Delights
            <br />
            for Every Occasion.
            <br />
            Made Fresh Daily.
          </p>

          <div className="w-2xl hidden lg:block h-64 rounded-full bg-radial from-slate-900/70 from-0% to-80% to-transparent absolute bottom-0 right-0 mr-48 z-10" />
        </div>
      </section>
      {/* <HeroCarousel /> */}

      <section className="mx-auto w-full px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[30px] font-bold leading-10 text-foreground uppercase">
            Our Signature Cakes
          </h2>
          <Link
            href="/shop/all"
            className="text-[14px] font-bold leading-5 text-foreground hover:text-foreground/70 uppercase"
          >
            Shop now
          </Link>
        </div>
        {hasError ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Unable to load products right now. Please check back soon.
          </p>
        ) : !hasProducts ? (
          <p className="mt-6 text-sm text-muted-foreground">
            No cakes available right now. Please check back soon.
          </p>
        ) : null}
        {hasProducts ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="relative min-h-[70vh] w-full overflow-hidden">
        <Image
          src="/home_banner.png"
          alt="Featured banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative mx-auto flex min-h-[70vh] w-full items-end px-6 lg:px-20 pb-16 text-background">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold uppercase">
              Union Made is Well Made{" "}
            </h2>
            <p className="text-sm text-background/80">
              Our cakes are crafted with premium ingredients to guarantee
              quality in every bite
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full flex-col xl:gap-64 px-6 py-16 md:flex-row md:items-center xl:justify-between">
        <div className="max-w-xl flex flex-col gap-6 p-16">
          <Image
            src="/union-bakery.png"
            alt="Union Bakery"
            width={140}
            height={36}
          />
          <div className="space-y-2">
            <h2 className="text-3xl font-bold leading-10 uppercase text-foreground">
              Group Order
            </h2>
            <p className="text-sm font-medium leading-5 text-muted-foreground">
              Whether you&apos;re treating clients or celebrating a company
              milestone, our cakes are sure to impress. We offer a variety of
              sizes to suit any occasion.
            </p>
          </div>
          <Link
            href="/group-order"
            className="inline-flex w-fit items-center justify-center bg-[#556B2F] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
          >
            Discover More
          </Link>
        </div>

        <div className="w-full overflow-hidden bg-muted/40 lg:w-[45%]">
          <Image
            src="/home_group_order.png"
            alt="Group order"
            width={1100}
            height={1650}
            className="h-auto w-full object-cover"
          />
        </div>
      </section>
    </main>
  );
}

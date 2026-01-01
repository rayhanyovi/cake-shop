import Image from "next/image";
import HeroCarousel from "@/src/components/HeroCarousel";
import { Button } from "@/src/components/ui/button";

const products = [
  {
    id: "1",
    name: "Red Velvet Cake",
    price: "IDR 150.000",
    image: "/file.svg",
  },
  {
    id: "2",
    name: "Classic Cheesecake",
    price: "IDR 170.000",
    image: "/file.svg",
  },
  {
    id: "3",
    name: "Chocolate Fudge",
    price: "IDR 165.000",
    image: "/file.svg",
  },
  { id: "4", name: "Vanilla Bean", price: "IDR 140.000", image: "/file.svg" },
];

export default function HomePage() {
  return (
    <main className="flex w-full flex-col -mt-18.25">
      {/* <section className="relative min-h-screen w-full overflow-hidden">
        <Image
          src="/Hero Banner.png"
          alt="Union Bakery hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-end justify-end px-6 pb-16 text-background">
          <div className="max-w-md space-y-4 text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/70">
              Union Bakery
            </p>
            <h1 className="text-4xl font-bold leading-tight">
              Lorem ipsum dolor sit amet consectetur
            </h1>
            <p className="text-sm text-background/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </section> */}
      <HeroCarousel />

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-foreground">
            Our Signature Cakes
          </h2>
          <Button variant="outline">Shop now</Button>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-3 border border-border bg-card p-4"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/40">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                />
              </div>
              <p className="text-sm font-semibold text-foreground">
                {product.name}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Price</span>
                <span className="font-semibold text-foreground">
                  {product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative min-h-[70vh] w-full overflow-hidden">
        <Image
          src="/Scrub B.jpg"
          alt="Featured banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative mx-auto flex min-h-[70vh] w-full max-w-6xl items-end px-6 pb-16 text-background">
          <div className="max-w-md space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/70">
              Featured
            </p>
            <h2 className="text-3xl font-bold">
              Lorem ipsum dolor sit amet consectetur
            </h2>
            <p className="text-sm text-background/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Group Order
          </p>
          <h2 className="text-3xl font-bold text-foreground">
            Make your event sweeter with Union Bakery
          </h2>
          <p className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <Button>Start a group order</Button>
        </div>
        <div className="relative h-72 w-full overflow-hidden bg-muted/40 lg:h-96 lg:w-[45%]">
          <Image
            src="/Scrub B.jpg"
            alt="Group order"
            fill
            className="object-cover"
          />
        </div>
      </section>
    </main>
  );
}

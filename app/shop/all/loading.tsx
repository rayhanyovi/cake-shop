export default function ShopAllLoading() {
  return (
    <main className="min-h-screen w-full">
      <section className="mx-auto w-full px-10 py-16">
        <header className="space-y-2">
          <div className="h-7 w-72 animate-pulse bg-muted/40" />
          <div className="h-4 w-64 animate-pulse bg-muted/30" />
        </header>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`shop-skeleton-${index}`}
              className="flex flex-col gap-3"
            >
              <div className="relative aspect-square w-full animate-pulse bg-muted/40" />
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 animate-pulse bg-muted/30" />
                <div className="h-4 w-16 animate-pulse bg-muted/30" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

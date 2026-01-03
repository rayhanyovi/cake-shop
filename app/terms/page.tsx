export default function TermsPage() {
  return (
    <main className="min-h-screen w-full px-6 py-12">
      <section className="mx-auto w-full max-w-6xl bg-card p-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h1 className="text-lg font-semibold uppercase tracking-[0.2em] text-foreground">
              Terms of Service
            </h1>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div />
        </div>
      </section>
    </main>
  );
}

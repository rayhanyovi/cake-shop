import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Cake Store. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="transition hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="transition hover:text-foreground">
            Privacy
          </Link>
          <Link href="/contact" className="transition hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

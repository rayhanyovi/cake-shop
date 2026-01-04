import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-foreground text-background">
      <div className="mx-auto flex w-full flex-col gap-10 px-6 py-10 text-sm">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
              Union Bakery
            </p>
            <div className="space-y-2 text-xs font-semibold uppercase tracking-wide">
              <Link href="/shop" className="block hover:text-background/70">
                Shop
              </Link>
              <Link
                href="/group-order"
                className="block hover:text-background/70"
              >
                Group Order
              </Link>
              <Link href="/faq" className="block hover:text-background/70">
                FAQ
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
              Get in touch
            </p>
            <div className="space-y-2 text-xs font-semibold uppercase tracking-wide">
              <p>WA. (+62)882 1157 3980</p>
              <p>E. bakery@unionjkt.com</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
              Connect with us
            </p>
            <div className="space-y-2 text-xs font-semibold uppercase tracking-wide">
              <p>@unionjkt</p>
              <p>@union.sby</p>
              <p className="normal-case font-semibold">WhatsApp</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
              Links
            </p>
            <div className="space-y-2 text-xs font-semibold uppercase tracking-wide">
              <Link href="/terms" className="block hover:text-background/70">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block hover:text-background/70">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-background/15 pt-4 text-xs text-background/60">
          © 2024 The Union Group. All rights reserved. Site by Rayhan Yovi, made
          for Antikode&apos;s technical test.
        </div>
      </div>
    </footer>
  );
}

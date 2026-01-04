"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import CartDrawer from "@/src/components/CartDrawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { LucideMenu } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/home";
  const isAuth = pathname.startsWith("/auth");
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuth: isLoggedIn } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [showCartTooltip, setShowCartTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<number | null>(null);
  const showBreadcrumb = pathname.startsWith("/product/") && !isAuth;
  const logoSrc = isAuth ? "/union-bakery.png" : "/union-bakery-white.png";
  const breadcrumbSlug = showBreadcrumb
    ? pathname.split("/").filter(Boolean).pop() ?? ""
    : "";
  const breadcrumbLabel = breadcrumbSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const showScrolled = isHome && isScrolled;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    if (isHome) {
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      media.removeEventListener("change", update);
    };
  }, [isHome]);

  const cartTooltip = showCartTooltip ? (
    <div className="w-fit absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded  bg-[#F4F3EF] px-4 py-4 text-[10px] uppercase text-foreground animate-in fade-in slide-in-from-top-2 duration-300">
      Added to cart
    </div>
  ) : null;

  useEffect(() => {
    const handleAdded = () => {
      setShowCartTooltip(true);
      if (tooltipTimeoutRef.current) {
        window.clearTimeout(tooltipTimeoutRef.current);
      }
      tooltipTimeoutRef.current = window.setTimeout(
        () => setShowCartTooltip(false),
        2000
      );
    };

    window.addEventListener("cart:added", handleAdded);
    return () => {
      window.removeEventListener("cart:added", handleAdded);
      if (tooltipTimeoutRef.current) {
        window.clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const mobileMenu = (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="transition duration-200 hover:text-primary-foreground/75 uppercase t"
          aria-label="Open menu"
        >
          <LucideMenu size={20} />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="border-foreground/10 bg-background w-full max-w-full"
        style={{
          backgroundImage: "url('/bg_pattern.webp')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Navigate the site
        </SheetDescription>
        <div className="flex h-full flex-col gap-6 px-6 py-10 text-xs font-bold uppercase tracking-[0.2em] text-foreground">
          <Link href="/shop/all" className="hover:text-foreground/70">
            Shop
          </Link>
          <Link href="/group-order" className="hover:text-foreground/70">
            Group Order
          </Link>
          <Link href="/faq" className="hover:text-foreground/70">
            FAQ
          </Link>
          <Link
            href={isLoggedIn ? "/account" : "/auth/login"}
            className="hover:text-foreground/70"
          >
            Account
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header
      className={[
        "relative w-full text-primary-foreground overflow-hidden",
        isHome ? "sticky top-0 z-50" : "",
        isAuth ? "bg-transparent" : "",
        isHome ? "bg-transparent" : "bg-primary",
        isAuth ? "border-transparent" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isHome ? (
        <>
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/40 to-transparent pointer-events-none" />
          <div
            className={[
              "absolute inset-0 bg-primary transition-transform duration-500 ease-out will-change-transform pointer-events-none",
              showScrolled ? "translate-y-0" : "-translate-y-full",
            ].join(" ")}
            aria-hidden="true"
          />
        </>
      ) : null}
      <div className="relative z-10 mx-auto flex w-full flex-col px-6 py-3">
        <div
          className={[
            "flex items-center",
            isAuth ? "justify-center" : "justify-between",
          ].join(" ")}
        >
          <Link href="/" className="inline-flex items-center">
            <Image
              src={logoSrc}
              alt="Union Bakery"
              width={140}
              height={36}
              className="!w-[7rem] !md:w-[8.5rem] !h-auto"
              priority
            />
          </Link>
          <nav
            className={[
              "flex items-center gap-6 text-xs font-bold text-primary-foreground",
              isAuth ? "hidden" : "",
            ].join(" ")}
          >
            {isMobile ? (
              <>
                <span className="relative">
                  {cartTooltip}
                  <CartDrawer isLoggedIn={isLoggedIn} fullWidth />
                </span>
                {mobileMenu}
              </>
            ) : (
              <>
                <Link
                  href="/shop/all"
                  className="transition duration-200 hover:text-primary-foreground/75 uppercase t"
                >
                  Shop
                </Link>
                <Link
                  href="/group-order"
                  className="transition duration-200 hover:text-primary-foreground/75 uppercase t"
                >
                  Group Order
                </Link>
                <Link
                  href="/faq"
                  className="transition duration-200 hover:text-primary-foreground/75 uppercase t"
                >
                  FAQ
                </Link>
                <>•</>
                <span className="relative">
                  {cartTooltip}
                  <CartDrawer isLoggedIn={isLoggedIn} />
                </span>
                <Link
                  href={isLoggedIn ? "/account" : "/auth/login"}
                  className="transition duration-200 hover:text-primary-foreground/75 uppercase t"
                >
                  Account
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {showBreadcrumb ? (
        <div className="mt-3 flex flex-row gap-4 text-xs font-medium uppercase tracking-wide bg-primary-darkened text-primary-foreground/70 py-2 px-5 md:px-8">
          <Link href="/" className="hover:text-primary-foreground">
            Home
          </Link>{" "}
          •{" "}
          <Link href="/shop/all" className="hover:text-primary-foreground">
            Shop
          </Link>{" "}
          • <span className="text-primary-foreground">{breadcrumbLabel}</span>
        </div>
      ) : null}
    </header>
  );
}

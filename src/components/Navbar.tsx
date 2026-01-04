"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { useCartAnchor } from "@/src/context/CartAnchorContext";
import CartDrawer from "@/src/components/CartDrawer";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/home";
  const isAuth = pathname.startsWith("/auth");
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuth: isLoggedIn } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [showCartTooltip, setShowCartTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<number | null>(null);
  const cartLinkRef = useRef<HTMLAnchorElement | null>(null);
  const { registerAnchor } = useCartAnchor();
  const showBreadcrumb = pathname.startsWith("/product/") && !isAuth;
  const logoSrc = isAuth ? "/union-bakery.png" : "/union-bakery-white.png";
  const breadcrumbSlug = showBreadcrumb
    ? pathname.split("/").filter(Boolean).pop() ?? ""
    : "";
  const breadcrumbLabel = breadcrumbSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);

    if (!isHome) {
      setIsScrolled(false);
      return () => media.removeEventListener("change", update);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      media.removeEventListener("change", update);
    };
  }, [isHome]);

  useEffect(() => {
    if (!isMobile) return;
    const element = cartLinkRef.current;
    if (!element) return;
    registerAnchor(element);
    return () => {
      registerAnchor(null);
    };
  }, [isMobile, registerAnchor]);

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

  const cartTooltip = showCartTooltip ? (
    <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded bg-[#2f3d1a] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white animate-in fade-in slide-in-from-top-2 duration-300">
      Added to cart
    </div>
  ) : null;

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
              isScrolled ? "translate-y-0" : "-translate-y-full",
            ].join(" ")}
            aria-hidden="true"
          />
        </>
      ) : null}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 py-3">
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
              priority
            />
          </Link>
          <nav
            className={[
              "flex items-center gap-6 text-xs font-bold text-primary-foreground",
              isAuth ? "hidden" : "",
            ].join(" ")}
          >
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
            {isMobile ? (
              <span className="relative">
                {cartTooltip}
                <Link
                  href={isLoggedIn ? "/cart" : "/auth/login"}
                  data-cart-target="true"
                  ref={cartLinkRef}
                  className="transition duration-200 hover:text-primary-foreground/75 uppercase t"
                >
                  Cart
                </Link>
              </span>
            ) : (
              <span className="relative">
                {cartTooltip}
                <CartDrawer isLoggedIn={isLoggedIn} />
              </span>
            )}

            <Link
              href={isLoggedIn ? "/account" : "/auth/login"}
              className="transition duration-200 hover:text-primary-foreground/75 uppercase t"
            >
              Account
            </Link>
          </nav>
        </div>
        {showBreadcrumb ? (
          <div className="mt-3 text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
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
      </div>
    </header>
  );
}

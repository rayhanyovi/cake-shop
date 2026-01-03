"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import CartDrawer from "@/src/components/CartDrawer";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/home";
  const isAuth = pathname.startsWith("/auth");
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuth: isLoggedIn } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
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
              <Link
                href={isLoggedIn ? "/cart" : "/auth/login"}
                className="transition duration-200 hover:text-primary-foreground/75 uppercase t"
              >
                Cart
              </Link>
            ) : (
              <CartDrawer isLoggedIn={isLoggedIn} />
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

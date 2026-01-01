"use client";

import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/home";
  const isAuth = pathname.startsWith("/auth");
  const isLoggedIn = false;
  const showBreadcrumb = pathname.startsWith("/shop/product/") && !isAuth;
  const logoSrc =
    isHome || isAuth ? "/union-bakery.png" : "/union-bakery-white.png";

  return (
    <header
      className={[
        "w-full border-b border-border text-primary-foreground backdrop-blur",
        isHome || isAuth ? "bg-transparent" : "bg-primary",
        isAuth ? "border-transparent" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6 py-3">
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
              href="/shop"
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
            <Link
              href={isLoggedIn ? "/cart" : "/auth/login"}
              className="transition duration-200 hover:text-primary-foreground/75 uppercase t"
            >
              Cart
            </Link>

            <Link
              href="/user"
              className="transition duration-200 hover:text-primary-foreground/75 uppercase t"
            >
              Account
            </Link>
          </nav>
        </div>
        {showBreadcrumb ? (
          <div className="mt-3 text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
            Breadcrumb goes here
          </div>
        ) : null}
      </div>
    </header>
  );
}

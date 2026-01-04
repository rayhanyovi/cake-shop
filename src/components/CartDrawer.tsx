"use client";

import * as React from "react";
import CartPanel from "./CartPanel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { useCartAnchor } from "@/src/context/CartAnchorContext";
import Link from "next/link";

type CartDrawerProps = {
  isLoggedIn: boolean;
  fullWidth?: boolean;
};

export default function CartDrawer({ isLoggedIn, fullWidth }: CartDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const linkRef = React.useRef<HTMLAnchorElement | null>(null);
  const { registerAnchor } = useCartAnchor();

  React.useEffect(() => {
    const element = (isLoggedIn ? buttonRef.current : linkRef.current) ?? null;
    if (!element) return;
    registerAnchor(element);
    return () => {
      registerAnchor(null);
    };
  }, [isLoggedIn, registerAnchor]);

  if (!isLoggedIn) {
    return (
      <Link
        href="/auth/login"
        ref={linkRef}
        data-cart-target="true"
        className="transition duration-200 hover:text-primary-foreground/75 uppercase t"
      >
        Cart
      </Link>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="transition duration-200 hover:text-primary-foreground/75 uppercase t"
          data-cart-target="true"
          ref={buttonRef}
        >
          Cart
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className={[
          "border-foreground/10 bg-background p-0",
          fullWidth ? "w-full max-w-full" : "w-[400px] max-w-[400px]",
        ].join(" ")}
        style={{
          backgroundImage: "url('/bg_pattern.webp')",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      >
        <SheetTitle className="sr-only">Cart</SheetTitle>
        <SheetDescription className="sr-only">
          Review items in your cart
        </SheetDescription>
        <CartPanel onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

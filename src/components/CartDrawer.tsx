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

type CartDrawerProps = {
  isLoggedIn: boolean;
};

export default function CartDrawer({ isLoggedIn }: CartDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const { registerAnchor } = useCartAnchor();

  React.useEffect(() => {
    const element = buttonRef.current;
    if (!element) return;
    registerAnchor(element);
    return () => {
      registerAnchor(null);
    };
  }, [registerAnchor]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="transition duration-200 hover:text-primary-foreground/75 uppercase t"
          data-cart-target="true"
          ref={buttonRef}
          onClick={(event) => {
            if (isLoggedIn) return;
            event.preventDefault();
            event.stopPropagation();
          }}
          aria-disabled={!isLoggedIn}
        >
          Cart
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="border-foreground/10 bg-[#c9c7c2]/95 p-0 w-[400px] max-w-[400px]"
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

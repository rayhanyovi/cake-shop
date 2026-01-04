"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, ShoppingBag } from "lucide-react";
import {
  getCart,
  removeCartItem,
  updateCartLine,
  type CartLine,
} from "../services/cart";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/src/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import {
  checkout,
  updateCartBuyerIdentity,
  type CheckoutPayload,
} from "../services/cart";
import { useAuth } from "../context/AuthContext";

type CartPanelProps = {
  onClose?: () => void;
};

type CartCache = {
  cartId: string;
  cart: {
    lines: {
      nodes: CartLine[];
    };
    cost: {
      subtotalAmount: {
        amount: number;
        currencyCode: string;
      };
    };
  };
};

const CART_CACHE_KEY = "cartCache";
const CHECKOUT_PENDING_KEY = "pendingCheckout";

const formatPrice = (value?: number | null) => {
  if (value === undefined || value === null) return "-";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
    value
  );
};

const buildNote = (attributes: CartLine["attributes"]) => {
  if (!attributes?.length) return null;
  return attributes
    .map((item) => item.value)
    .filter(Boolean)
    .join(" · ");
};

const getAttributeValue = (attributes: CartLine["attributes"], key: string) =>
  attributes.find((item) => item.key.toLowerCase() === key.toLowerCase())
    ?.value ?? "";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function CartPanel({ onClose }: CartPanelProps) {
  const router = useRouter();
  const { accessToken, isAuth } = useAuth();
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [subtotal, setSubtotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(null);
  const [editingLine, setEditingLine] = useState<CartLine | null>(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editCakeWording, setEditCakeWording] = useState("");
  const [editGreetingWording, setEditGreetingWording] = useState("");
  const [editIncludeCake, setEditIncludeCake] = useState(false);
  const [editIncludeGreeting, setEditIncludeGreeting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [removingLineId, setRemovingLineId] = useState<string | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const isResumingRef = useRef(false);
  const rowRefs = useRef(new Map<string, HTMLDivElement>());
  const prevPositions = useRef(new Map<string, DOMRect>());

  useEffect(() => {
    const loadCart = async () => {
      const storedCartId = localStorage.getItem("cartId");
      if (!storedCartId) {
        setIsLoading(false);
        return;
      }

      const cachedRaw = localStorage.getItem(CART_CACHE_KEY);
      if (cachedRaw) {
        try {
          const cached = JSON.parse(cachedRaw) as CartCache;
          if (cached?.cartId === storedCartId) {
            setCartLines(cached.cart?.lines?.nodes ?? []);
            setSubtotal(cached.cart?.cost?.subtotalAmount?.amount ?? null);
            setCartId(storedCartId);
            setIsLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem(CART_CACHE_KEY);
        }
      }

      try {
        setCartId(storedCartId);
        const response = await getCart({ cartId: storedCartId });
        const cart = response?.data?.cart;
        setCartLines(cart?.lines?.nodes ?? []);
        setSubtotal(cart?.cost?.subtotalAmount?.amount ?? null);
        if (cart) {
          const cache: CartCache = { cartId: storedCartId, cart };
          localStorage.setItem(CART_CACHE_KEY, JSON.stringify(cache));
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const hasItems = cartLines.length > 0;
  const deliverySlots = useMemo(() => {
    return ["11AM - 2PM", "3PM - 5PM", "6PM - 8PM"];
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  const buildCheckoutPayload = useCallback(
    (): CheckoutPayload => ({
      cartId: cartId ?? "",
      phone: deliveryPhone,
      deliveryTime,
      deliveryDate: deliveryDate
        ? deliveryDate.toISOString().split("T")[0]
        : "",
    }),
    [cartId, deliveryDate, deliveryPhone, deliveryTime]
  );

  const handleCheckout = useCallback(
    async (payload: CheckoutPayload) => {
      if (!payload.cartId) return;
      setIsCheckingOut(true);
      try {
        await updateCartBuyerIdentity(
          { cartId: payload.cartId },
          accessToken ?? undefined
        );
        await checkout(payload, accessToken ?? undefined);
        localStorage.removeItem(CHECKOUT_PENDING_KEY);
        localStorage.removeItem(CART_CACHE_KEY);
        showToast("Checkout successful");
        setShowDeliveryModal(false);
        if (onClose) onClose();
      } catch (error) {
        console.error("Failed to checkout:", error);
      } finally {
        setIsCheckingOut(false);
      }
    },
    [accessToken, onClose, showToast]
  );

  useEffect(() => {
    if (!isAuth || isResumingRef.current) return;
    const pending = localStorage.getItem(CHECKOUT_PENDING_KEY);
    if (!pending) return;
    try {
      const parsed = JSON.parse(pending) as {
        cartId: string;
        phone: string;
        deliveryTime: string;
        deliveryDate: string;
      };
      if (!parsed?.cartId) return;
      isResumingRef.current = true;
      handleCheckout({
        cartId: parsed.cartId,
        phone: parsed.phone ?? "",
        deliveryTime: parsed.deliveryTime ?? "",
        deliveryDate: parsed.deliveryDate ?? "",
      }).finally(() => {
        isResumingRef.current = false;
      });
    } catch {
      localStorage.removeItem(CHECKOUT_PENDING_KEY);
    }
  }, [isAuth, handleCheckout]);

  const openEditor = (line: CartLine) => {
    setEditingLine(line);
    setEditQuantity(line.quantity);
    const cakeWording = getAttributeValue(line.attributes, "Cake Wording");
    const greetingWording = getAttributeValue(line.attributes, "Greetings");
    setEditCakeWording(cakeWording);
    setEditGreetingWording(greetingWording);
    setEditIncludeCake(Boolean(cakeWording));
    setEditIncludeGreeting(Boolean(greetingWording));
  };

  const closeEditor = () => {
    setEditingLine(null);
  };

  const handleSaveEdit = async () => {
    if (!editingLine || !cartId) return;
    setIsSaving(true);
    try {
      localStorage.removeItem(CART_CACHE_KEY);
      const response = await updateCartLine({
        cartId,
        lineId: editingLine.id,
        quantity: editQuantity,
        cakeWording:
          editIncludeCake && editCakeWording ? editCakeWording : undefined,
        greetingWording:
          editIncludeGreeting && editGreetingWording
            ? editGreetingWording
            : undefined,
      });
      const cart = response?.data?.cartLinesUpdate?.cart;
      setCartLines(cart?.lines?.nodes ?? []);
      setSubtotal(cart?.cost?.subtotalAmount?.amount ?? null);
      closeEditor();
    } catch (error) {
      console.error("Failed to update cart line:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveLine = async (lineId: string) => {
    if (!cartId) return;
    try {
      setRemovingLineId(lineId);
      localStorage.removeItem(CART_CACHE_KEY);
      const response = await removeCartItem({ cartId, lineIds: lineId });
      const cart = response?.data;
      setCartLines(cart?.lines?.nodes ?? []);
      setSubtotal(cart?.cost?.subtotalAmount?.amount ?? null);
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    } finally {
      setRemovingLineId(null);
    }
  };

  useLayoutEffect(() => {
    const newPositions = new Map<string, DOMRect>();
    cartLines.forEach((line) => {
      const node = rowRefs.current.get(line.id);
      if (node) {
        newPositions.set(line.id, node.getBoundingClientRect());
      }
    });

    prevPositions.current.forEach((prevBox, key) => {
      const nextBox = newPositions.get(key);
      const node = rowRefs.current.get(key);
      if (!nextBox || !node) return;

      const deltaY = prevBox.top - nextBox.top;
      if (deltaY !== 0) {
        node.style.transform = `translateY(${deltaY}px)`;
        node.style.transition = "transform 0s";
        requestAnimationFrame(() => {
          node.style.transform = "";
          node.style.transition = "transform 200ms ease";
        });
      }
    });

    prevPositions.current = newPositions;
  }, [cartLines]);

  return (
    <section className="min-h-screen w-full bg-transparent px-6 py-8 text-foreground flex flex-col">
      {toastMessage ? (
        <div className="fixed right-6 top-6 z-[9999] rounded bg-[#2f3d1a] px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white animate-in fade-in slide-in-from-top-2 duration-300">
          {toastMessage}
        </div>
      ) : null}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold uppercase tracking-[0.2em]">
            Cart
          </h1>
          <p className="text-xs italic text-foreground/70">
            *All prices shown are in thousands of rupiah
          </p>
        </div>
      </div>

      <div className="mt-6 flex-1 space-y-6 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={`cart-skeleton-${index}`}
                className="border-b border-foreground/20 pb-6 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="h-20 w-20 bg-muted/40" />
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="h-3 w-2/3 bg-muted/40" />
                    <div className="h-3 w-1/2 bg-muted/30" />
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-12 bg-muted/30" />
                      <div className="h-3 w-16 bg-muted/40" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hasItems ? (
          cartLines.map((item) => {
            const note = buildNote(item.attributes);
            const amount = Number(item.merchandise?.price?.amount ?? "0");
            const imageUrl = item.merchandise?.image?.url ?? "/file.svg";
            const title =
              item.merchandise?.product?.title ?? item.merchandise?.title;
            const slug = title ? slugify(title) : "";

            const isRemoving = removingLineId === item.id;

            const cakeWording = getAttributeValue(
              item.attributes,
              "Cake Wording"
            );
            const greeting = getAttributeValue(item.attributes, "Greetings");
            const wordingLine =
              cakeWording && greeting
                ? "with cake wording & greeting card"
                : cakeWording
                ? "with cake wording"
                : greeting
                ? "with greeting card"
                : null;

            return (
              <div
                key={item.id}
                ref={(node) => {
                  if (node) {
                    rowRefs.current.set(item.id, node);
                  } else {
                    rowRefs.current.delete(item.id);
                  }
                }}
                className={[
                  "border-b border-foreground/20 pb-6 motion-safe:transition-all motion-safe:duration-300",
                  isRemoving ? "opacity-50" : "opacity-100",
                ].join(" ")}
              >
                <div className="flex gap-4">
                  <Link
                    href={slug ? `/product/${slug}` : "#"}
                    className="relative h-20 w-20 overflow-hidden bg-muted/30"
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                  >
                    <Image
                      src={imageUrl}
                      alt={title ?? "Cart item"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={slug ? `/product/${slug}` : "#"}
                          className="text-[14px] font-semibold leading-5 tracking-normal hover:text-foreground"
                          onClick={() => {
                            if (onClose) onClose();
                          }}
                        >
                          {title}
                        </Link>
                        <p className="text-xs font-medium leading-4 text-foreground/60">
                          {[item.merchandise?.title, wordingLine]
                            .filter(Boolean)
                            .join(" ")}
                        </p>
                        {note ? (
                          <p className="text-xs text-foreground/60">{note}</p>
                        ) : null}
                      </div>
                      <span className="text-[16px] font-serif font-normal uppercase leading-5 text-price">
                        {formatPrice(amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-foreground/70">
                      <span className="font-serif">{item.quantity}x</span>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className="text-xs font-semibold uppercase leading-4 tracking-normal hover:text-foreground"
                          onClick={() => openEditor(item)}
                          disabled={isRemoving}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-xs font-semibold uppercase leading-4 tracking-normal hover:text-foreground"
                          onClick={() => handleRemoveLine(item.id)}
                          disabled={isRemoving}
                        >
                          {isRemoving ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center mt-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-foreground/20 text-foreground/60">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-foreground/80">
              Cart is empty
            </p>
            <p className="mt-2 text-xs text-foreground/60">
              Let&apos;s find something sweet for you.
            </p>
            <Link
              href="/shop/all"
              className="mt-4 inline-flex items-center justify-center bg-[#556B2F] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
            >
              Shop now
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-foreground/20 pt-6 text-xs uppercase tracking-[0.2em] text-foreground/70">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="text-sm font-semibold font-serif text-price">
            {formatPrice(subtotal)}
          </span>
        </div>
        {hasItems ? (
          <button
            type="button"
            onClick={() => setShowDeliveryModal(true)}
            className="mt-5 w-full bg-[#556B2F] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
          >
            Choose delivery time
          </button>
        ) : null}
      </div>

      <Sheet
        open={Boolean(editingLine)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closeEditor();
        }}
      >
        <SheetContent side="right" className="bg-[#c9c7c2]/98 p-0">
          <SheetTitle className="sr-only">Edit item</SheetTitle>
          <SheetDescription className="sr-only">
            Update quantity or wording details.
          </SheetDescription>

          <div className="flex h-full flex-col px-6 py-6 text-foreground">
            <button
              type="button"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70"
              onClick={closeEditor}
            >
              Back
            </button>

            <div className="mt-4 border-b border-foreground/20 pb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                {editingLine?.merchandise?.product?.title ??
                  editingLine?.merchandise?.title ??
                  "Item"}
              </p>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-foreground/20 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Add cake wording
                  </p>
                  <p className="text-[11px] text-foreground/60">
                    Optional · max. 50 characters
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={editIncludeCake}
                  onChange={(event) => setEditIncludeCake(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#556B2F]"
                  aria-label="Add cake wording"
                />
              </div>
              {editIncludeCake ? (
                <textarea
                  rows={2}
                  maxLength={50}
                  value={editCakeWording}
                  onChange={(event) => setEditCakeWording(event.target.value)}
                  className="w-full resize-none border border-foreground/30 bg-transparent px-3 py-2 text-sm focus:border-foreground/60 focus:outline-none"
                  placeholder="Enter message"
                />
              ) : null}

              <div className="flex items-start justify-between gap-4 border-b border-foreground/20 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Add greeting card
                  </p>
                  <p className="text-[11px] text-foreground/60">
                    Optional · max. 100 characters
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={editIncludeGreeting}
                  onChange={(event) =>
                    setEditIncludeGreeting(event.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-[#556B2F]"
                  aria-label="Add greeting card"
                />
              </div>
              {editIncludeGreeting ? (
                <textarea
                  rows={3}
                  maxLength={100}
                  value={editGreetingWording}
                  onChange={(event) =>
                    setEditGreetingWording(event.target.value)
                  }
                  className="w-full resize-none border border-foreground/30 bg-transparent px-3 py-2 text-sm focus:border-foreground/60 focus:outline-none"
                  placeholder="Enter message"
                />
              ) : null}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-foreground/20 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={() =>
                    setEditQuantity((value) => Math.max(1, value - 1))
                  }
                  className="h-8 w-8 rounded-full border border-foreground/50 text-base"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="text-base font-semibold font-serif">
                  {editQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setEditQuantity((value) => value + 1)}
                  className="h-8 w-8 rounded-full border border-foreground/50 text-base"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="text-sm font-semibold font-serif text-price">
                {formatPrice(
                  Number(editingLine?.merchandise?.price?.amount ?? 0) *
                    editQuantity
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="mt-6 w-full bg-[#556B2F] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Updating..." : "Update"}
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={showDeliveryModal}
        onOpenChange={(nextOpen) => setShowDeliveryModal(nextOpen)}
      >
        <SheetContent
          side="right"
          className="bg-[#c9c7c2]/98 p-0 text-foreground"
        >
          <SheetTitle className="sr-only">Delivery details</SheetTitle>
          <SheetDescription className="sr-only">
            Choose delivery date, time, and phone number.
          </SheetDescription>

          <div className="flex h-full flex-col px-6 py-6">
            <button
              type="button"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70 w-fit"
              onClick={() => setShowDeliveryModal(false)}
            >
              Back
            </button>

            <div className="mt-6 space-y-5">
              <div className="space-y-2 border-b border-foreground/20 pb-4">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/60">
                  Delivery date
                </label>
                <Popover
                  open={isDatePickerOpen}
                  onOpenChange={setIsDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between text-left text-sm text-foreground"
                    >
                      <span>
                        {deliveryDate
                          ? deliveryDate.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Pick a date"}
                      </span>
                      <CalendarIcon className="h-4 w-4 text-foreground/60" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deliveryDate ?? undefined}
                      onSelect={(date) => {
                        setDeliveryDate(date ?? null);
                        setIsDatePickerOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {deliveryDate ? (
                <div className="space-y-2 pb-4">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/60">
                    Delivery time
                  </label>
                  <Select
                    value={deliveryTime}
                    onValueChange={(value) => setDeliveryTime(value)}
                  >
                    <SelectTrigger className="w-full border-0 border-b border-foreground/30 bg-transparent text-sm text-foreground rounded-none px-0">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliverySlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              {deliveryDate && deliveryTime ? (
                <div className="space-y-2 pb-4">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/60">
                    Phone number
                  </label>
                  <Input
                    type="tel"
                    value={deliveryPhone}
                    onChange={(event) =>
                      setDeliveryPhone(event.target.value.replace(/\D/g, ""))
                    }
                    className="border-0 border-b border-foreground/30 bg-transparent px-0 text-sm text-foreground"
                    placeholder="Input phone number"
                  />
                  <p className="text-xs text-foreground/60">
                    Enter your phone number or your U+Rewards phone number to
                    earn U+ points on this order.
                  </p>
                </div>
              ) : null}
            </div>

            {deliveryDate && deliveryTime ? (
              <button
                type="button"
                className="mt-auto w-full bg-[#556B2F] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!deliveryPhone}
                onClick={() => {
                  if (!deliveryPhone) return;
                  if (!isAuth) {
                    const pendingPayload = buildCheckoutPayload();
                    localStorage.setItem(
                      CHECKOUT_PENDING_KEY,
                      JSON.stringify(pendingPayload)
                    );
                    router.push("/auth/login?ref=/cart");
                    return;
                  }
                  handleCheckout(buildCheckoutPayload());
                }}
              >
                {isCheckingOut ? "Processing..." : "Proceed to checkout"}
              </button>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ProductDetail } from "../services/product";
import {
  addCartLine,
  createCart,
  getCart,
  type CartLine,
} from "../services/cart";
import { useAuth } from "../context/AuthContext";
import AddToCartFlyer from "@/src/components/AddToCartFlyer";
import { formatPrice } from "@/src/utils/formatPrice";

type ProductDetailPanelProps = {
  product: ProductDetail;
};

const getInitialVariantId = (variants: ProductDetail["variants"]["nodes"]) => {
  const available = variants.find((variant) => variant.availableForSale);
  return (available ?? variants[0])?.id ?? null;
};

export default function ProductDetailPanel({
  product,
}: ProductDetailPanelProps) {
  const { accessToken } = useAuth();
  const variants = useMemo(
    () => product.variants?.nodes ?? [],
    [product.variants]
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    () => getInitialVariantId(variants)
  );
  const [includeWording, setIncludeWording] = useState(false);
  const [includeGreeting, setIncludeGreeting] = useState(false);
  const [wordingText, setWordingText] = useState("");
  const [greetingText, setGreetingText] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantityPulse, setQuantityPulse] = useState(false);
  const [cartMatches, setCartMatches] = useState<CartLine[]>([]);
  const [isCartChecking, setIsCartChecking] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement | null>(null);
  const errorTimeoutRef = useRef<number | null>(null);
  const [flySequence, setFlySequence] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const handleFlyArrive = useCallback(() => {
    window.dispatchEvent(new CustomEvent("cart:added"));
  }, []);

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId) ?? null,
    [selectedVariantId, variants]
  );
  const hasSizeOption = useMemo(
    () =>
      product.options?.some(
        (option) => option.name?.toLowerCase() === "size"
      ) ?? false,
    [product.options]
  );
  const sizeVariants = useMemo(() => {
    if (!hasSizeOption) return [];
    return variants.filter((variant) =>
      variant.selectedOptions?.some(
        (option) => option.name?.toLowerCase() === "size"
      )
    );
  }, [hasSizeOption, variants]);

  const unitAmount = selectedVariant?.price?.amount
    ? Number(selectedVariant.price.amount)
    : null;
  const totalAmount =
    unitAmount !== null && Number.isFinite(unitAmount)
      ? unitAmount * quantity
      : null;
  const price = formatPrice(totalAmount ?? undefined);
  const isOutOfStock = !selectedVariant?.availableForSale;

  useEffect(() => {
    const loadCartMatches = async () => {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) return;
      setIsCartChecking(true);
      try {
        const response = await getCart({ cartId });
        const lines = response?.data?.cart?.lines?.nodes ?? [];
        const matches = lines.filter(
          (line) =>
            line.merchandise?.product?.title?.toLowerCase() ===
            product.title.toLowerCase()
        );
        setCartMatches(matches);
      } catch (error) {
        console.error("Failed to check cart:", error);
      } finally {
        setIsCartChecking(false);
      }
    };

    loadCartMatches();
  }, [product.title]);

  useEffect(() => {
    setQuantityPulse(true);
    const timer = window.setTimeout(() => setQuantityPulse(false), 200);
    return () => window.clearTimeout(timer);
  }, [quantity]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        window.clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const getAttributeValue = (attributes: CartLine["attributes"], key: string) =>
    attributes.find((item) => item.key.toLowerCase() === key.toLowerCase())
      ?.value ?? "";

  const handleAddToCart = async () => {
    if (!selectedVariant?.id || !selectedVariant.availableForSale) {
      return;
    }

    setIsSubmitting(true);
    setActionError(null);
    try {
      const payload = {
        variantId: selectedVariant.id,
        quantity,
        ...(includeWording && wordingText ? { cakeWording: wordingText } : {}),
        ...(includeGreeting && greetingText
          ? { greetingWording: greetingText }
          : {}),
      };

      const existingCartId = localStorage.getItem("cartId");
      const response = existingCartId
        ? await addCartLine(
            { cartId: existingCartId, ...payload },
            accessToken ?? undefined
          )
        : await createCart(payload, accessToken ?? undefined);

      if (response?.data?.id) {
        localStorage.setItem("cartId", response.data.id);
        localStorage.removeItem("cartCache");
      }
      const cartId = response?.data?.id ?? localStorage.getItem("cartId");
      if (cartId) {
        setIsCartChecking(true);
        const refreshed = await getCart({ cartId });
        const lines = refreshed?.data?.cart?.lines?.nodes ?? [];
        const matches = lines.filter(
          (line) =>
            line.merchandise?.product?.title?.toLowerCase() ===
            product.title.toLowerCase()
        );
        setCartMatches(matches);
      }
      setFlySequence((value) => value + 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setActionError("Unable to add to cart. Please try again.");
      if (errorTimeoutRef.current) {
        window.clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = window.setTimeout(() => {
        setActionError(null);
      }, 3000);
    } finally {
      setIsSubmitting(false);
      setIsCartChecking(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 p-8 text-foreground">
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-6">
          <h1 className="text-2xl font-bold uppercase">{product.title}</h1>
          <span className="text-3xl font-serif text-price">{price}</span>
        </div>
        <p className="text-sm text-foreground/70">{product.description}</p>
      </div>
      <div className="h-px w-full bg-foreground/20" />

      {hasSizeOption ? (
        <div className="space-y-3 uppercase text-foreground/80">
          <p className="font-semibold">Cake size</p>
          <div className=" grid grid-cols-2 md:grid-cols-4 gap-3">
            {sizeVariants.length > 0 ? (
              sizeVariants.map((variant) => {
                const sizeOption = variant.selectedOptions?.find(
                  (option) => option.name?.toLowerCase() === "size"
                );
                const label = sizeOption?.value ?? variant.title;
                const isAvailable = variant.availableForSale;
                const isSelected = variant.id === selectedVariantId;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() =>
                      isAvailable ? setSelectedVariantId(variant.id) : null
                    }
                    className={[
                      "flex flex-col items-center justify-center  px-6 py-4 text-sm  font-semibold uppercasex transition",
                      isAvailable
                        ? "border-foreground/50 text-foreground border-2"
                        : "cursor-not-allowed border-foreground/20 text-foreground/40 grayscale border opacity-75",
                      isSelected && isAvailable
                        ? "bg-foreground/5"
                        : "bg-transparent",
                    ].join(" ")}
                  >
                    <span className="font-serif text-price text-2xl">
                      {label}
                    </span>
                    <span>cm</span>
                  </button>
                );
              })
            ) : (
              <div className="col-span-2 text-[11px] uppercase  text-foreground/60">
                No size options
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div className="h-px w-full bg-foreground/20" />

      <div className="space-y-3 uppercase text-foreground/80">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Add cake wording</p>
            <p className="text-sm normal-case text-foreground/60">
              Optional · max. 50 characters
            </p>
          </div>
          <input
            type="checkbox"
            checked={includeWording}
            onChange={(event) => setIncludeWording(event.target.checked)}
            className="h-4 w-4 accent-[#556B2F]"
            aria-label="Add cake wording"
          />
        </div>
        {includeWording ? (
          <textarea
            value={wordingText}
            onChange={(event) => setWordingText(event.target.value)}
            maxLength={50}
            rows={2}
            className="w-full resize-none border border-foreground/30 bg-white p-2 text-sm normal-case tracking-normal text-foreground/80 focus:border-foreground/60 focus:outline-none"
            placeholder="Add your cake wording..."
          />
        ) : null}
        <div className="h-px w-full bg-foreground/20" />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Add greeting card</p>
            <p className="text-sm normal-case text-foreground/60">
              Optional · max. 100 characters
            </p>
          </div>
          <input
            type="checkbox"
            checked={includeGreeting}
            onChange={(event) => setIncludeGreeting(event.target.checked)}
            className="h-4 w-4 accent-[#556B2F]"
            aria-label="Add greeting card"
          />
        </div>
        {includeGreeting ? (
          <textarea
            value={greetingText}
            onChange={(event) => setGreetingText(event.target.value)}
            maxLength={100}
            rows={3}
            className="w-full resize-none border border-foreground/30 bg-white p-2 text-sm normal-case tracking-normal text-foreground/80 focus:border-foreground/60 focus:outline-none"
            placeholder="Add your greeting card message..."
          />
        ) : null}
      </div>

      <div className="h-px w-full bg-foreground/20" />

      <div className="space-y-3 text-foreground/70">
        <p className="text-base font-semibold uppercase">
          Terms &amp; conditions
        </p>
        <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed">
          <li>Preparation may take up to 2 hours before dispatch.</li>
          <li>Minimum purchase of IDR 350,000 is required for delivery.</li>
          <li>Delivery available with a flat fare for select areas.</li>
          <li>
            Products may contain allergens such as nuts, dairy, and gluten.
          </li>
        </ul>
      </div>

      {cartMatches.length > 0 ? (
        <div className="border border-foreground/20 bg-[#f3f1ec] px-4 py-3 text-xs uppercase text-foreground/70">
          <p className="font-semibold text-foreground/80">
            You already have this product on your cart with these details:
          </p>
          <ul className="mt-2 space-y-1 pl-4">
            {cartMatches.map((line) => {
              const cakeWording = getAttributeValue(
                line.attributes,
                "Cake Wording"
              );
              const greeting = getAttributeValue(line.attributes, "Greetings");
              return (
                <li key={line.id} className="list-disc">
                  {`${line.merchandise?.title ?? "Variant"} cm`} · Qty{" "}
                  <span className="font-serif">{line.quantity}</span>
                  {cakeWording ? ` · Cake: ${cakeWording}` : ""}
                  {greeting ? ` · Greeting: ${greeting}` : ""}
                </li>
              );
            })}
          </ul>
        </div>
      ) : isCartChecking ? (
        <div className="text-[11px] uppercase tracking-[0.2em] text-foreground/60">
          Checking cart...
        </div>
      ) : null}

      <div className="min-h-[18px]">
        {actionError ? (
          <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-2 duration-300">
            {actionError}
          </p>
        ) : null}
      </div>

      <div className="sticky bottom-0 mt-auto flex w-screen -mx-8 items-center justify-between border border-foreground bg-background px-6 py-4 text-xs uppercase tracking-[0.2em] md:w-full md:mx-0">
        <div className="space-y-2">
          <p className="font-semibold">Quantity</p>
          <div className="flex items-center gap-4 text-sm">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="h-8 w-8 rounded-full border border-foreground/50 text-base"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span
              className={[
                "text-base font-semibold font-serif transition",
                quantityPulse ? "scale-110 text-price" : "scale-100",
              ].join(" ")}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((value) => value + 1)}
              className="h-8 w-8 rounded-full border border-foreground/50 text-base"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isSubmitting}
            ref={addButtonRef}
            className="bg-[#556B2F] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isOutOfStock ? "Out of stock" : isSubmitting ? "Adding..." : "Add to cart"}
          </button>
        </div>
      </div>
      <AddToCartFlyer
        trigger={flySequence}
        startRef={addButtonRef}
        onArrive={handleFlyArrive}
      />
    </div>
  );
}

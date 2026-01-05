"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getCustomerProfile,
  type CustomerProfile,
} from "@/src/services/customer";
import { useAuth } from "@/src/context/AuthContext";
import { Button } from "@/src/components/ui/button";
import { formatPrice } from "@/src/utils/formatPrice";

type OrderLine = {
  id: string;
  title: string;
  quantity: number;
  price: number;
  note?: string | null;
  image?: string | null;
};

type OrderData = {
  deliveryDate: string;
  deliveryTime: string;
  phone: string;
  lines: OrderLine[];
  subtotal: number;
};

type StoredOrder = {
  data: OrderData;
  expiresAt: number;
};

const ORDER_STORAGE_KEY = "lastOrder";
const ORDER_EVENT = "order:changed";
let orderCacheRaw: string | null = null;
let orderCache: StoredOrder | null = null;

const readOrderSnapshot = () => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(ORDER_STORAGE_KEY);
  if (stored === orderCacheRaw) return orderCache;

  orderCacheRaw = stored;
  if (!stored) {
    orderCache = null;
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as StoredOrder;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "data" in parsed &&
      "expiresAt" in parsed
    ) {
      const expiresAt = Number(parsed.expiresAt);
      if (Number.isFinite(expiresAt) && Date.now() < expiresAt) {
        orderCache = parsed;
        return orderCache;
      }
    }
  } catch {
    orderCache = null;
    return null;
  }

  orderCache = null;
  return null;
};

const subscribeOrder = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(ORDER_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(ORDER_EVENT, handler);
  };
};

export default function OrderPage() {
  const { accessToken } = useAuth();
  const storedOrder = useSyncExternalStore(
    subscribeOrder,
    readOrderSnapshot,
    () => null
  );
  const order = storedOrder?.data ?? null;
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    const loadCustomer = async () => {
      try {
        const response = await getCustomerProfile(accessToken);
        setCustomer(response?.data ?? null);
      } catch (error) {
        console.error("Failed to load customer:", error);
      }
    };
    loadCustomer();
  }, [accessToken]);

  useEffect(() => {
    if (!storedOrder) return;
    const remaining = storedOrder.expiresAt - Date.now();
    if (remaining <= 0) {
      localStorage.removeItem(ORDER_STORAGE_KEY);
      window.dispatchEvent(new Event(ORDER_EVENT));
      return;
    }
    const timer = window.setTimeout(() => {
      localStorage.removeItem(ORDER_STORAGE_KEY);
      window.dispatchEvent(new Event(ORDER_EVENT));
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [storedOrder]);

  if (!order) {
    return (
      <main className="min-h-screen w-full px-6 py-12">
        <section className="mx-auto w-full max-w-2xl space-y-4 bg-card p-6">
          <h1 className="text-lg font-semibold uppercase tracking-[0.2em]">
            Order
          </h1>
          <p className="text-sm text-muted-foreground">
            You have no active order.
          </p>
          <Button asChild className="w-fit">
            <Link href="/shop/all">Shop now</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full px-6 py-12">
      <section className="mx-auto w-full max-w-2xl space-y-6 bg-card p-6">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold uppercase tracking-[0.2em]">
            Order
          </h1>
          {customer ? (
            <>
              <p className="text-sm text-muted-foreground">
                Name: {customer.firstName} {customer.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                Email: {customer.email}
              </p>
            </>
          ) : null}
          <p className="text-sm text-muted-foreground">
            Delivery date: {order.deliveryDate}
          </p>
          <p className="text-sm text-muted-foreground">
            Delivery time: {order.deliveryTime}
          </p>
          <p className="text-sm text-muted-foreground">
            Phone: {order.phone}
          </p>
        </div>

        <div className="space-y-4">
          {order.lines.map((line) => (
            <div
              key={line.id}
              className="flex items-start justify-between border-b border-border pb-4"
            >
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 overflow-hidden bg-muted/30">
                  {line.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={line.image}
                      alt={line.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em]">
                    {line.title}
                  </p>
                  {line.note ? (
                    <p className="text-xs text-muted-foreground">{line.note}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    Qty: <span className="font-serif">{line.quantity}</span>
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold font-serif text-price">
                {formatPrice(line.price, { fallback: "-" })}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span>Subtotal</span>
          <span className="text-sm font-semibold font-serif text-price">
            {formatPrice(order.subtotal, { fallback: "-" })}
          </span>
        </div>
      </section>
    </main>
  );
}

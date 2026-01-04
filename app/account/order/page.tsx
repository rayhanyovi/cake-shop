"use client";

import { useEffect, useState } from "react";
import { getCustomerProfile, type CustomerProfile } from "@/src/services/customer";
import { useAuth } from "@/src/context/AuthContext";

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

type CheckoutInfo = {
  contactEmail: string;
  delivery: {
    country: string;
    firstName: string;
    lastName: string;
    province: string;
    city: string;
    address: string;
    postalCode: string;
    phone: string;
  };
};

const formatPrice = (value?: number | null) => {
  if (value === undefined || value === null) return "-";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
    value,
  );
};

export default function OrderPage() {
  const { accessToken } = useAuth();
  const [order] = useState<OrderData | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("lastOrder");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as OrderData;
    } catch {
      return null;
    }
  });
  const [checkoutInfo] = useState<CheckoutInfo | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("checkoutInfo");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as CheckoutInfo;
    } catch {
      return null;
    }
  });
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

  if (!order) {
    return (
      <main className="min-h-screen w-full px-6 py-12">
        <section className="mx-auto w-full max-w-2xl space-y-4 bg-card p-6">
          <h1 className="text-lg font-semibold uppercase tracking-[0.2em]">
            Order
          </h1>
          <p className="text-sm text-muted-foreground">
            No order data found yet.
          </p>
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
          {checkoutInfo?.delivery ? (
            <>
              <p className="text-sm text-muted-foreground">
                Address: {checkoutInfo.delivery.address},{" "}
                {checkoutInfo.delivery.city},{" "}
                {checkoutInfo.delivery.province}{" "}
                {checkoutInfo.delivery.postalCode},{" "}
                {checkoutInfo.delivery.country}
              </p>
              <p className="text-sm text-muted-foreground">
                Recipient: {checkoutInfo.delivery.firstName}{" "}
                {checkoutInfo.delivery.lastName} ·{" "}
                {checkoutInfo.delivery.phone}
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
                {formatPrice(line.price)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span>Subtotal</span>
          <span className="text-sm font-semibold font-serif text-price">
            {formatPrice(order.subtotal)}
          </span>
        </div>
      </section>
    </main>
  );
}

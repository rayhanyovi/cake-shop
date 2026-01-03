"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
  shippingMethod: {
    id: "internal_courier";
    label: string;
    price: number;
  };
  paymentMethod: "qris" | "bank_transfer";
};

export default function CheckoutPage() {
  const router = useRouter();
  const [contactEmail, setContactEmail] = useState("");
  const [delivery, setDelivery] = useState({
    country: "",
    firstName: "",
    lastName: "",
    province: "",
    city: "",
    address: "",
    postalCode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<
    "qris" | "bank_transfer"
  >("qris");

  const shippingMethod = {
    id: "internal_courier" as const,
    label: "Internal Courier",
    price: 25000,
  };

  const handlePay = () => {
    const info: CheckoutInfo = {
      contactEmail,
      delivery,
      shippingMethod,
      paymentMethod,
    };
    localStorage.setItem("checkoutInfo", JSON.stringify(info));
    router.push("/account/order");
  };

  return (
    <main className="min-h-screen w-full px-6 py-12">
      <section className="mx-auto w-full max-w-2xl space-y-8 bg-card p-6">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold uppercase tracking-[0.2em] text-foreground">
            Checkout
          </h1>
          <p className="text-sm text-muted-foreground">
            Mock payment page. Fill details before paying.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">
            Contact
          </h2>
          <input
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            placeholder="Email"
            className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-foreground/60 focus:outline-none"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">
            Delivery
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={delivery.country}
              onChange={(event) =>
                setDelivery((prev) => ({ ...prev, country: event.target.value }))
              }
              placeholder="Country"
              className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-foreground/60 focus:outline-none"
            />
            <input
              type="text"
              value={delivery.province}
              onChange={(event) =>
                setDelivery((prev) => ({
                  ...prev,
                  province: event.target.value,
                }))
              }
              placeholder="Province"
              className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-foreground/60 focus:outline-none"
            />
            <input
              type="text"
              value={delivery.firstName}
              onChange={(event) =>
                setDelivery((prev) => ({
                  ...prev,
                  firstName: event.target.value,
                }))
              }
              placeholder="First name"
              className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-foreground/60 focus:outline-none"
            />
            <input
              type="text"
              value={delivery.lastName}
              onChange={(event) =>
                setDelivery((prev) => ({
                  ...prev,
                  lastName: event.target.value,
                }))
              }
              placeholder="Last name"
              className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-foreground/60 focus:outline-none"
            />
            <input
              type="text"
              value={delivery.city}
              onChange={(event) =>
                setDelivery((prev) => ({ ...prev, city: event.target.value }))
              }
              placeholder="City"
              className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-foreground/60 focus:outline-none"
            />
            <input
              type="text"
              value={delivery.postalCode}
              onChange={(event) =>
                setDelivery((prev) => ({
                  ...prev,
                  postalCode: event.target.value,
                }))
              }
              placeholder="Postal code"
              className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-foreground/60 focus:outline-none"
            />
          </div>
          <input
            type="text"
            value={delivery.address}
            onChange={(event) =>
              setDelivery((prev) => ({ ...prev, address: event.target.value }))
            }
            placeholder="Address"
            className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-foreground/60 focus:outline-none"
          />
          <input
            type="tel"
            value={delivery.phone}
            onChange={(event) =>
              setDelivery((prev) => ({ ...prev, phone: event.target.value }))
            }
            placeholder="Recipient phone number"
            className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-foreground/60 focus:outline-none"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">
            Shipping method
          </h2>
          <div className="flex items-center justify-between border border-border px-4 py-3 text-sm">
            <span>{shippingMethod.label}</span>
            <span className="font-semibold font-serif text-price">
              IDR {new Intl.NumberFormat("id-ID").format(shippingMethod.price)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">
            Payment method
          </h2>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="qris"
                checked={paymentMethod === "qris"}
                onChange={() => setPaymentMethod("qris")}
              />
              QRIS
            </label>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="bank_transfer"
                checked={paymentMethod === "bank_transfer"}
                onChange={() => setPaymentMethod("bank_transfer")}
              />
              Bank transfer
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePay}
          className="w-full bg-[#556B2F] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
        >
          Pay the bill
        </button>
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { orderOperations } from "@/lib/firestore";
import type { Order } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const JOURNEY: { key: Order["status"]; label: string; note: string }[] = [
  { key: "pending", label: "Received", note: "Your order is with us" },
  { key: "processing", label: "Being prepared", note: "Packed & handed to the courier" },
  { key: "completed", label: "Delivered", note: "In your garden's hands" },
];

/**
 * Order tracking — same lookup contract (order number + email),
 * presented as a quiet journey line rather than a status pill.
 */
export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const allOrders = await orderOperations.getAll();
      const foundOrder = allOrders.find(
        (o) =>
          o.orderId.toLowerCase() === orderId.trim().toLowerCase() &&
          o.customerEmail.toLowerCase() === email.trim().toLowerCase()
      );

      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError("We couldn't find that order. Check the order number and email and try again.");
      }
    } catch (err) {
      console.error("Error tracking order:", err);
      setError("Something went wrong while looking that up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const journeyIndex =
    order === null
      ? -1
      : order.status === "cancelled"
      ? -1
      : JOURNEY.findIndex((s) => s.key === order.status);

  return (
    <div className="bg-parchment">
      <div className="mx-auto max-w-3xl px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
        <Reveal y={20}>
          <p className="eyebrow text-forest">Track order</p>
        </Reveal>
        <TextReveal
          as="h1"
          text={"Where is it now?"}
          className="font-display mt-6 text-4xl font-light leading-[1.05] text-ink sm:text-6xl"
        />
        <Reveal delay={0.25}>
          <p className="prose-editorial mt-6 max-w-md text-ink/70">
            Your order number is in the confirmation email — it looks like
            ORD-123456. Pair it with the email you ordered with.
          </p>
        </Reveal>

        {/* The lookup */}
        <Reveal delay={0.35}>
          <form
            onSubmit={handleTrackOrder}
            className="hairline-t mt-12 grid grid-cols-1 gap-7 pt-10 sm:grid-cols-2"
          >
            <div>
              <label htmlFor="orderId" className="field-label">
                Order number
              </label>
              <input
                id="orderId"
                type="text"
                required
                disabled={loading}
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="ORD-123456"
                className="field-input uppercase placeholder:normal-case"
              />
            </div>
            <div>
              <label htmlFor="email" className="field-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="field-input"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-clay-deep sm:col-span-2">
                {error}
              </p>
            )}
            <div className="sm:col-span-2">
              <button type="submit" disabled={loading} className="btn-clay w-full sm:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                    Looking it up
                  </>
                ) : (
                  "Find my order"
                )}
              </button>
            </div>
          </form>
        </Reveal>

        {/* The findings */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mt-16 border border-ink/15 p-8 sm:p-10"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl font-medium text-ink">
                {order.orderId}
              </h2>
              <p className="text-sm text-ink/65">
                Placed{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* The journey */}
            {order.status === "cancelled" ? (
              <p className="mt-8 border border-clay/40 bg-clay/5 px-6 py-4 text-[0.9375rem] text-clay-deep">
                This order was cancelled. If that&rsquo;s unexpected, please{" "}
                <Link href="/contact" className="underline">
                  write to us
                </Link>
                .
              </p>
            ) : (
              <ol className="mt-10 space-y-0" aria-label="Order progress">
                {JOURNEY.map((stage, i) => {
                  const reached = i <= journeyIndex;
                  const isLast = i === JOURNEY.length - 1;
                  return (
                    <li key={stage.key} className="relative flex gap-5 pb-8 last:pb-0">
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className={`absolute left-[11px] top-7 h-[calc(100%-1.25rem)] w-px ${
                            i < journeyIndex ? "bg-forest" : "bg-ink/15"
                          }`}
                        />
                      )}
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          reached
                            ? "border-forest bg-forest text-parchment"
                            : "border-ink/20 bg-transparent"
                        }`}
                      >
                        {reached && <Check className="h-3 w-3" strokeWidth={2.5} />}
                      </span>
                      <div className="-mt-0.5">
                        <p
                          className={`text-[0.8125rem] font-bold uppercase tracking-[0.16em] ${
                            reached ? "text-ink" : "text-ink/65"
                          }`}
                        >
                          {stage.label}
                        </p>
                        <p className={`mt-0.5 text-sm ${reached ? "text-ink/70" : "text-ink/30"}`}>
                          {stage.note}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            {/* The contents */}
            <div className="hairline-t mt-10 pt-7">
              <p className="eyebrow text-ink/65">Contents</p>
              <ul className="mt-4 divide-y divide-ink/10">
                {order.items.map((item, index) => (
                  <li key={index} className="flex items-baseline justify-between gap-4 py-3.5">
                    <p className="text-[0.9375rem] text-ink/80">
                      {item.productName}
                      {item.size ? ` · ${item.size}` : ""}{" "}
                      <span className="text-ink/65">× {item.quantity}</span>
                    </p>
                    <p className="shrink-0 text-sm font-semibold text-ink">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="hairline-t mt-2 flex items-baseline justify-between pt-5">
                <p className="font-display text-lg text-ink">Total</p>
                <p className="font-display text-2xl font-medium text-ink">
                  ₹{order.totalAmount.toFixed(0)}
                </p>
              </div>
            </div>

            <div className="hairline-t mt-8 pt-6">
              <p className="eyebrow text-ink/65">Delivering to</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/70">
                {order.customerName} · {order.shippingAddress}
              </p>
            </div>
          </motion.div>
        )}

        <Reveal delay={0.45}>
          <p className="mt-12 text-sm text-ink/65">
            Need a hand?{" "}
            <Link href="/contact" className="link-rule text-ink">
              Write to us
            </Link>{" "}
            — gardeners answer.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

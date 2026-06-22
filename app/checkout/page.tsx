"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Order } from "@/lib/types";
import { orderOperations } from "@/lib/firestore";
import { blurFor } from "@/lib/blur-data";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PaymentMethod = "razorpay" | "cod";
type Step = 1 | 2;

/**
 * Checkout in two unhurried acts:
 *   01 — Where it's going (contact + shipping)
 *   02 — How you'd like to pay (Razorpay / cash on delivery)
 * with the order summary always at hand, and a full-screen
 * confirmation when the order is placed.
 */
export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [errorMessage, setErrorMessage] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: string;
    code: string;
    discountAmount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Pre-fill from the signed-in account.
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || "",
      }));
    }
  }, [user]);

  // Razorpay checkout script.
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (orderPlaced) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [orderPlaced]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getFinalTotal = () => {
    const subtotal = getCartTotal();
    if (appliedCoupon) {
      return Math.max(0, subtotal - appliedCoupon.discountAmount);
    }
    return subtotal;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setValidatingCoupon(true);
    setCouponError("");
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          orderTotal: getCartTotal(),
          // Lets the server enforce first-time-only coupons if the email is
          // already filled; re-checked authoritatively at pay time anyway.
          customerEmail: formData.customerEmail || undefined,
        }),
      });
      const data = await response.json();
      if (!data.valid) {
        setCouponError(data.message || "Invalid coupon code");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({
          id: data.coupon.id,
          code: data.coupon.code,
          discountAmount: data.coupon.discountAmount,
        });
        setCouponError("");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Failed to apply coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const createOrder = async (
    status: "pending" | "processing" | "completed" = "pending",
    paymentId?: string,
    paidTotal?: number
  ) => {
    try {
      const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
      const order: Omit<Order, "id"> = {
        orderId: newOrderId,
        // Firestore rejects undefined field values — only attach userId
        // when the shopper is signed in (guest checkout must stay valid).
        ...(user?.id ? { userId: user.id } : {}),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        items: cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.cartQuantity,
          price: item.price,
          size: item.weight, // variant size travels as weight — load-bearing
        })),
        // For online payments, record the server-priced amount that was
        // actually charged; for COD, the client-side total.
        totalAmount: paidTotal ?? getFinalTotal(),
        status,
        createdAt: new Date().toISOString(),
        shippingAddress: `${formData.shippingAddress}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        paymentMethod,
        // Keep the Razorpay payment reference on paid orders (omitted for COD).
        ...(paymentId ? { paymentId } : {}),
      };

      const createdOrderId = await orderOperations.create(order);

      // Conversion analytics — fire and forget.
      try {
        const productIds = cart.map((item) => item.id);
        await fetch("/api/analytics/track-conversion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds }),
        });
      } catch (analyticsError) {
        console.error("Error tracking conversions:", analyticsError);
      }

      // Count the coupon redemption.
      if (appliedCoupon) {
        try {
          await fetch("/api/coupons/use", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ couponId: appliedCoupon.id }),
          });
        } catch (couponUseError) {
          console.error("Error incrementing coupon usage:", couponUseError);
        }
      }

      // Confirmation email — only when the shopper actually gave an email
      // (phone-login accounts may not have one). The order survives even if
      // this fails. TODO: when no email, send an SMS confirmation instead
      // (needs a transactional SMS provider — Firebase only sends login OTPs).
      if (order.customerEmail?.trim()) {
        try {
          await fetch("/api/send-order-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...order, id: createdOrderId }),
          });
        } catch (emailError) {
          console.error("Error sending order confirmation email:", emailError);
        }
      }

      setOrderId(newOrderId);
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error("Error creating order:", error);
      let message = "We couldn't place the order. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("permission")) {
          message = "Permission denied. Please check your connection and try again.";
        } else if (error.message.includes("network")) {
          message = "Network error. Please check your internet connection.";
        } else if (error.message.includes("quota")) {
          message = "Service temporarily unavailable. Please try again later.";
        }
      }
      // If money was already captured, the customer must be able to quote a
      // reference so support can recover the order.
      if (paymentId) {
        message = `Your payment went through (reference ${paymentId}) but we couldn't save the order. Please contact us with this reference and we'll sort it out — you will not be charged again.`;
      }
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      // The server re-prices the cart from live data — we send what we're
      // buying, never what it costs.
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            size: item.weight,
            quantity: item.cartQuantity,
          })),
          couponCode: appliedCoupon?.code,
          customerEmail: formData.customerEmail,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create Razorpay order");
      }
      const serverTotal = data.amount / 100; // paise → rupees

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Folia",
        description: "Organic plant care",
        order_id: data.orderId,
        handler: async function (rzpResponse: any) {
          // Never trust the success callback alone — verify the signature
          // server-side before recording the order as paid.
          try {
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: rzpResponse.razorpay_order_id,
                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                razorpay_signature: rzpResponse.razorpay_signature,
              }),
            });
            const verification = await verifyResponse.json();
            if (!verifyResponse.ok || !verification.verified) {
              setErrorMessage(
                "We couldn't verify the payment. If you were charged, please contact us with your payment reference."
              );
              setIsProcessing(false);
              return;
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            setErrorMessage(
              "We couldn't verify the payment. If you were charged, please contact us with your payment reference."
            );
            setIsProcessing(false);
            return;
          }
          await createOrder(
            "processing",
            rzpResponse.razorpay_payment_id,
            serverTotal
          );
        },
        prefill: {
          name: formData.customerName,
          email: formData.customerEmail,
          contact: formData.customerPhone,
        },
        theme: { color: "#315C3B" },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay payment error:", error);
      setErrorMessage(
        error instanceof Error && error.message && error.message !== "Failed to create Razorpay order"
          ? error.message
          : "We couldn't start the payment. Please try again."
      );
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsProcessing(true);
    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment();
    } else {
      await createOrder("pending");
    }
  };

  /* ——— Confirmation: the curtain call ——— */
  if (orderPlaced) {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center bg-parchment px-6 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-forest"
        >
          <Check className="h-7 w-7 text-forest" strokeWidth={1.5} />
        </motion.div>
        <TextReveal
          as="h1"
          text={"Thank you.\nIt's on its way to the soil."}
          className="font-display mt-10 max-w-2xl text-4xl font-light leading-[1.12] text-ink sm:text-6xl"
          delay={0.3}
        />
        <Reveal delay={0.8}>
          <p className="mt-8 text-[0.9375rem] text-ink/70">
            Your order number is{" "}
            <span className="font-semibold text-ink">{orderId}</span>.
            <br />A confirmation email is on its way to you.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user && (
              <Link href="/profile" className="btn-ghost-ink">
                View my orders
              </Link>
            )}
            <Link href="/products" className="btn-clay">
              Continue browsing
            </Link>
          </div>
          <Link
            href="/track-order"
            className="link-rule mt-8 inline-flex text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/65 hover:text-ink"
          >
            Track this order
          </Link>
        </Reveal>
      </div>
    );
  }

  /* ——— Empty cart guard ——— */
  if (cart.length === 0) {
    return (
      <div className="flex min-h-[88svh] flex-col items-center justify-center bg-parchment px-6 text-center">
        <p className="eyebrow text-forest">Checkout</p>
        <h1 className="font-display mt-6 max-w-xl text-3xl font-light leading-tight text-ink sm:text-5xl">
          There&rsquo;s nothing to check out —{" "}
          <em className="text-forest">yet.</em>
        </h1>
        <Link href="/products" className="btn-clay mt-10">
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-parchment">
      <div className="mx-auto max-w-[1480px] px-5 pb-28 pt-32 sm:px-8 sm:pt-36 lg:px-12">
        <Reveal y={16}>
          <p className="eyebrow text-forest">Checkout</p>
          <h1 className="font-display mt-5 text-4xl font-light leading-[1.05] text-ink sm:text-5xl">
            Almost in the ground.
          </h1>
        </Reveal>

        {/* Progress — two quiet steps */}
        <Reveal delay={0.15}>
          <ol className="hairline-b mt-10 flex gap-10 pb-4" aria-label="Checkout steps">
            {[
              { n: 1 as Step, label: "Where it's going" },
              { n: 2 as Step, label: "How you'll pay" },
            ].map((s) => (
              <li key={s.n}>
                <button
                  onClick={() => s.n < step && setStep(s.n)}
                  disabled={s.n > step}
                  className={`flex items-baseline gap-3 text-[0.75rem] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                    step === s.n
                      ? "text-ink"
                      : s.n < step
                      ? "text-forest hover:text-ink"
                      : "text-ink/30"
                  }`}
                  aria-current={step === s.n ? "step" : undefined}
                >
                  <span className="font-display text-base italic">
                    {s.n < step ? <Check className="inline h-4 w-4" strokeWidth={2} /> : `0${s.n}`}
                  </span>
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        </Reveal>

        {errorMessage && (
          <div
            role="alert"
            className="mt-8 border border-clay/40 bg-clay/5 px-6 py-4 text-[0.9375rem] text-clay-deep"
          >
            {errorMessage}
          </div>
        )}

        <div className="mt-12 flex flex-col gap-16 lg:flex-row lg:gap-20">
          {/* ——— The form, in two acts ——— */}
          <div className="lg:w-[58%]">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="step-1"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <fieldset>
                    <legend className="font-display text-2xl font-light text-ink">
                      Contact
                    </legend>
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="customerName" className="field-label">
                          Full name
                        </label>
                        <input
                          id="customerName"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          required
                          autoComplete="name"
                          placeholder="Asha Iyer"
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label htmlFor="customerEmail" className="field-label">
                          Email{" "}
                          <span className="font-normal normal-case tracking-normal text-ink/45">
                            (optional — for an email receipt)
                          </span>
                        </label>
                        <input
                          id="customerEmail"
                          name="customerEmail"
                          type="email"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          autoComplete="email"
                          placeholder="asha@example.com"
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label htmlFor="customerPhone" className="field-label">
                          Phone
                        </label>
                        <input
                          id="customerPhone"
                          name="customerPhone"
                          type="tel"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          required
                          autoComplete="tel"
                          placeholder="+91 98765 43210"
                          className="field-input"
                        />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className="mt-12">
                    <legend className="font-display text-2xl font-light text-ink">
                      Shipping address
                    </legend>
                    <div className="mt-6 space-y-6">
                      <div>
                        <label htmlFor="shippingAddress" className="field-label">
                          Address
                        </label>
                        <textarea
                          id="shippingAddress"
                          name="shippingAddress"
                          value={formData.shippingAddress}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          autoComplete="street-address"
                          placeholder="House no., street, locality"
                          className="field-input resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div>
                          <label htmlFor="city" className="field-label">
                            City
                          </label>
                          <input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            autoComplete="address-level2"
                            placeholder="Bengaluru"
                            className="field-input"
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="field-label">
                            State
                          </label>
                          <input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            autoComplete="address-level1"
                            placeholder="Karnataka"
                            className="field-input"
                          />
                        </div>
                        <div>
                          <label htmlFor="pincode" className="field-label">
                            Pincode
                          </label>
                          <input
                            id="pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            required
                            inputMode="numeric"
                            autoComplete="postal-code"
                            placeholder="560001"
                            className="field-input"
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  <button type="submit" className="btn-clay group mt-12 w-full sm:w-auto">
                    Continue to payment
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="step-2"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  onSubmit={handlePlaceOrder}
                >
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="link-rule group inline-flex text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink/65 hover:text-ink"
                  >
                    <ArrowLeft
                      className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1"
                      strokeWidth={1.5}
                    />
                    Edit details
                  </button>

                  {/* Where it's going — a quiet recap */}
                  <div className="hairline-b mt-8 pb-6">
                    <p className="eyebrow text-ink/65">Delivering to</p>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/80">
                      <span className="font-semibold text-ink">
                        {formData.customerName}
                      </span>{" "}
                      · {formData.customerPhone}
                      <br />
                      {formData.shippingAddress}, {formData.city},{" "}
                      {formData.state} — {formData.pincode}
                    </p>
                  </div>

                  <fieldset className="mt-10">
                    <legend className="font-display text-2xl font-light text-ink">
                      Payment
                    </legend>
                    <div className="mt-6 space-y-4">
                      {[
                        {
                          value: "razorpay" as PaymentMethod,
                          title: "Pay now",
                          detail: "Card, UPI, net banking & wallets — via Razorpay",
                        },
                        {
                          value: "cod" as PaymentMethod,
                          title: "Cash on delivery",
                          detail: "Pay when the order reaches your door",
                        },
                      ].map((method) => {
                        const selected = paymentMethod === method.value;
                        return (
                          <label
                            key={method.value}
                            className={`flex cursor-pointer items-start gap-5 border p-6 transition-all duration-400 ${
                              selected
                                ? "border-ink bg-parchment-deep"
                                : "border-ink/20 hover:border-ink/50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.value}
                              checked={selected}
                              onChange={() => setPaymentMethod(method.value)}
                              className="sr-only"
                            />
                            <span
                              aria-hidden="true"
                              className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                                selected ? "border-ink" : "border-ink/30"
                              }`}
                            >
                              {selected && (
                                <span className="h-2 w-2 rounded-full bg-ink" />
                              )}
                            </span>
                            <span>
                              <span className="font-display block text-lg font-medium text-ink">
                                {method.title}
                              </span>
                              <span className="mt-1 block text-sm text-ink/70">
                                {method.detail}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-clay mt-12 w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                        Processing
                      </>
                    ) : paymentMethod === "razorpay" ? (
                      <>Pay ₹{getFinalTotal().toFixed(0)}</>
                    ) : (
                      <>Place order — ₹{getFinalTotal().toFixed(0)}</>
                    )}
                  </button>
                  <p className="mt-4 text-center text-xs text-ink/65">
                    Free shipping across India · Easy returns
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ——— The summary rail ——— */}
          <div className="lg:w-[42%]">
            <div className="border border-ink/15 p-8 lg:sticky lg:top-28">
              <p className="eyebrow text-ink/65">Your order</p>

              <ul className="mt-6 divide-y divide-ink/10">
                {cart.map((item) => (
                  <li key={`${item.id}-${item.weight}`} className="flex gap-4 py-4">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-parchment-deep">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="56px"
                          placeholder={blurFor(item.image) ? "blur" : "empty"}
                          blurDataURL={blurFor(item.image)}
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display truncate text-[1.0625rem] font-medium text-ink">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-ink/65">
                        {item.weight} × {item.cartQuantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-ink">
                      ₹{(item.price * item.cartQuantity).toFixed(0)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* The coupon line */}
              <div className="hairline-t pt-5">
                {!appliedCoupon ? (
                  <>
                    <label
                      htmlFor="coupon"
                      className="eyebrow block !text-[0.625rem] text-ink/70"
                    >
                      Coupon
                    </label>
                    <div className="flex border-b border-ink/25 focus-within:border-ink">
                      <input
                        id="coupon"
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="w-full bg-transparent py-3 text-sm uppercase tracking-[0.1em] text-ink placeholder:normal-case placeholder:tracking-normal placeholder:text-ink/65 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon}
                        className="pl-4 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink/70 transition-colors hover:text-ink disabled:opacity-40"
                      >
                        {validatingCoupon ? (
                          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>
                    {couponError && (
                      <p className="mt-2 text-xs text-clay-deep" role="alert">
                        {couponError}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between bg-forest/5 px-4 py-3">
                    <p className="text-sm text-forest">
                      <span className="font-bold uppercase tracking-[0.1em]">
                        {appliedCoupon.code}
                      </span>{" "}
                      — you saved ₹{appliedCoupon.discountAmount.toFixed(0)}
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink/65 transition-colors hover:text-clay"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* The arithmetic */}
              <dl className="mt-6 space-y-3">
                <div className="flex justify-between text-[0.9375rem]">
                  <dt className="text-ink/70">Subtotal</dt>
                  <dd className="font-semibold text-ink">
                    ₹{getCartTotal().toFixed(0)}
                  </dd>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[0.9375rem]">
                    <dt className="text-forest">Discount</dt>
                    <dd className="font-semibold text-forest">
                      −₹{appliedCoupon.discountAmount.toFixed(0)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between text-[0.9375rem]">
                  <dt className="text-ink/70">Shipping</dt>
                  <dd className="text-forest">On us</dd>
                </div>
                <div className="hairline-t flex items-baseline justify-between pt-4">
                  <dt className="font-display text-xl text-ink">Total</dt>
                  <dd className="font-display text-3xl font-medium text-ink">
                    ₹{getFinalTotal().toFixed(0)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

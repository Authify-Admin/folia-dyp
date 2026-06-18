"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { orderOperations, returnRequestOperations } from "@/lib/firestore";
import { uploadReturnImages } from "@/lib/storage";
import type { Order } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Received",
  processing: "Being prepared",
  completed: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_TONE: Record<Order["status"], string> = {
  pending: "text-clay-deep",
  processing: "text-forest",
  completed: "text-forest",
  cancelled: "text-ink/65",
};

/**
 * The member's room: account details, order history, and the
 * return-request desk (same Firestore + Storage contracts).
 */
export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, updateUser } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [formData, setFormData] = useState({ name: "", phone: "" });

  // Return request desk
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");
  const [returnImageFiles, setReturnImageFiles] = useState<File[]>([]);
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returnError, setReturnError] = useState("");
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    setFormData({ name: user.name, phone: user.phone || "" });

    let cancelled = false;
    setLoadingOrders(true);
    orderOperations
      .getAll()
      .then((allOrders) => {
        if (cancelled) return;
        // Match by userId or email — older orders may predate accounts.
        setOrders(
          allOrders.filter(
            (order) =>
              order.userId === user.id || order.customerEmail === user.email
          )
        );
      })
      .catch((error) => console.error("Error loading orders:", error))
      .finally(() => {
        if (!cancelled) setLoadingOrders(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    setProfileError("");
    try {
      await updateUser({ name: formData.name, phone: formData.phone });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileError("We couldn't save those changes. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const closeReturnDesk = () => {
    setSelectedOrder(null);
    setReturnReason("");
    setReturnDescription("");
    setReturnImageFiles([]);
    setReturnError("");
    setReturnSubmitted(false);
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !user) return;

    setSubmittingReturn(true);
    setReturnError("");
    try {
      let imageUrls: string[] = [];
      if (returnImageFiles.length > 0) {
        imageUrls = await uploadReturnImages(
          returnImageFiles,
          selectedOrder.orderId
        );
      }

      await returnRequestOperations.create({
        orderId: selectedOrder.id,
        orderNumber: selectedOrder.orderId,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || selectedOrder.customerPhone,
        reason: returnReason,
        description: returnDescription,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      setReturnSubmitted(true);
    } catch (err) {
      console.error("Error submitting return request:", err);
      setReturnError("We couldn't submit the request. Please try again.");
    } finally {
      setSubmittingReturn(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const remainingSlots = 5 - returnImageFiles.length;
    setReturnImageFiles([...returnImageFiles, ...files.slice(0, remainingSlots)]);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <Loader2 className="h-8 w-8 animate-spin text-forest" strokeWidth={1.5} />
      </div>
    );
  }

  if (!user) return null;

  const completedOrders = orders.filter((o) => o.status === "completed");

  return (
    <div className="bg-parchment">
      <div className="mx-auto max-w-[1480px] px-5 pb-28 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        {/* The greeting */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal y={16}>
              <p className="eyebrow text-forest">Your account</p>
            </Reveal>
            <TextReveal
              as="h1"
              text={`Hello, ${user.name.split(" ")[0]}.`}
              className="font-display mt-5 text-4xl font-light leading-[1.05] text-ink sm:text-6xl"
            />
          </div>
          <Reveal delay={0.2}>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="link-rule text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink/65 hover:text-clay"
            >
              Sign out
            </button>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-16 lg:flex-row lg:gap-20">
          {/* ——— The ledger (left rail) ——— */}
          <div className="lg:w-[34%]">
            <Reveal delay={0.15}>
              <div className="border border-ink/15 p-8">
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-ink/65">Details</p>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink/65 transition-colors hover:text-ink"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-forest transition-colors hover:text-ink disabled:opacity-40"
                      >
                        {savingProfile ? "Saving…" : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setProfileError("");
                          setFormData({ name: user.name, phone: user.phone || "" });
                        }}
                        className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink/65 transition-colors hover:text-clay"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {profileError && (
                  <p role="alert" className="mt-4 text-xs text-clay-deep">
                    {profileError}
                  </p>
                )}

                <dl className="mt-6 space-y-6">
                  <div>
                    <dt className="field-label !mb-1.5">Name</dt>
                    <dd>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="field-input"
                        />
                      ) : (
                        <p className="text-[0.9375rem] text-ink">{user.name}</p>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="field-label !mb-1.5">Email</dt>
                    <dd>
                      <p className="text-[0.9375rem] text-ink/70">{user.email}</p>
                    </dd>
                  </div>
                  <div>
                    <dt className="field-label !mb-1.5">Phone</dt>
                    <dd>
                      {editMode ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+91 98765 43210"
                          className="field-input"
                        />
                      ) : (
                        <p className="text-[0.9375rem] text-ink/70">
                          {user.phone || "Not provided"}
                        </p>
                      )}
                    </dd>
                  </div>
                  <div className="hairline-t pt-5">
                    <dt className="field-label !mb-1.5">Gardening with us since</dt>
                    <dd>
                      <p className="text-[0.9375rem] text-ink/70">
                        {formatDate(user.createdAt)}
                      </p>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* The tally */}
              <div className="mt-6 grid grid-cols-3 divide-x divide-ink/12 border border-ink/15">
                {[
                  [String(orders.length), "orders"],
                  [String(completedOrders.length), "delivered"],
                  [
                    `₹${completedOrders
                      .reduce((sum, o) => sum + o.totalAmount, 0)
                      .toFixed(0)}`,
                    "in the soil",
                  ],
                ].map(([value, caption]) => (
                  <div key={caption} className="px-4 py-6 text-center">
                    <p className="font-display text-2xl font-light text-ink">{value}</p>
                    <p className="eyebrow mt-1.5 !text-[0.5625rem] text-ink/65">
                      {caption}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ——— Order history ——— */}
          <div id="orders" className="lg:w-[66%]">
            <Reveal delay={0.25}>
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="font-display text-2xl font-light text-ink sm:text-3xl">
                  Order history
                </h2>
                <Link
                  href="/products"
                  className="link-rule text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink/70 hover:text-ink"
                >
                  Browse the collection
                </Link>
              </div>

              {loadingOrders ? (
                <div className="mt-10 space-y-4">
                  {[0, 1].map((i) => (
                    <div key={i} className="h-36 animate-pulse bg-ink/5" aria-hidden="true" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="hairline-t mt-8 pt-16 text-center">
                  <p className="font-display text-2xl font-light text-ink">
                    No orders yet — <em className="text-forest">every garden starts somewhere.</em>
                  </p>
                  <Link href="/products" className="btn-clay mt-8">
                    Start with the essentials
                  </Link>
                </div>
              ) : (
                <ul className="mt-8 space-y-5">
                  {orders.map((order) => (
                    <li key={order.id} className="border border-ink/15 p-7">
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <div>
                          <p className="font-display text-xl font-medium text-ink">
                            {order.orderId}
                          </p>
                          <p className="mt-1 text-xs text-ink/65">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <p
                          className={`text-[0.6875rem] font-bold uppercase tracking-[0.18em] ${STATUS_TONE[order.status]}`}
                        >
                          {STATUS_LABEL[order.status]}
                        </p>
                      </div>

                      <ul className="mt-5 divide-y divide-ink/8">
                        {order.items.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-baseline justify-between gap-4 py-2.5 text-sm"
                          >
                            <span className="text-ink/75">
                              {item.productName}
                              {item.size ? ` · ${item.size}` : ""}{" "}
                              <span className="text-ink/65">× {item.quantity}</span>
                            </span>
                            <span className="shrink-0 font-semibold text-ink">
                              ₹{(item.price * item.quantity).toFixed(0)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="hairline-t mt-3 flex flex-wrap items-center justify-between gap-4 pt-4">
                        <p className="text-sm text-ink/70">
                          Total{" "}
                          <span className="font-display text-lg font-medium text-ink">
                            ₹{order.totalAmount.toFixed(0)}
                          </span>
                        </p>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink/65 transition-colors hover:text-clay"
                        >
                          Report an issue / return
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </div>
        </div>
      </div>

      {/* ——— The returns desk ——— */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.button
              aria-label="Close"
              className="fixed inset-0 z-[70] bg-ink/45 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={closeReturnDesk}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Return request"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="fixed left-1/2 top-1/2 z-[80] max-h-[88svh] w-[calc(100%-2.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-parchment p-8 shadow-2xl"
              data-lenis-prevent
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-clay-deep">Returns desk</p>
                  <h3 className="font-display mt-3 text-2xl font-light text-ink">
                    {returnSubmitted ? "Request received" : "Tell us what went wrong"}
                  </h3>
                </div>
                <button
                  onClick={closeReturnDesk}
                  aria-label="Close"
                  className="p-1 text-ink/65 transition-colors hover:text-ink"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              {returnSubmitted ? (
                <div className="mt-8">
                  <p className="prose-editorial text-ink/70">
                    Thank you — we&rsquo;ll review it shortly and write to you at{" "}
                    <span className="text-ink">{user.email}</span>. Most requests
                    are answered within a couple of days.
                  </p>
                  <button onClick={closeReturnDesk} className="btn-ghost-ink mt-8">
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <p className="mt-4 text-sm text-ink/70">
                    Order{" "}
                    <span className="font-semibold text-ink">
                      {selectedOrder.orderId}
                    </span>{" "}
                    · {formatDate(selectedOrder.createdAt)}
                  </p>

                  {returnError && (
                    <p role="alert" className="mt-4 text-sm text-clay-deep">
                      {returnError}
                    </p>
                  )}

                  <form onSubmit={handleSubmitReturn} className="mt-7 space-y-6">
                    <div>
                      <label htmlFor="returnReason" className="field-label">
                        Reason
                      </label>
                      <input
                        id="returnReason"
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        required
                        disabled={submittingReturn}
                        placeholder="Damaged in transit, wrong item, quality issue…"
                        className="field-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="returnDescription" className="field-label">
                        What happened
                      </label>
                      <textarea
                        id="returnDescription"
                        value={returnDescription}
                        onChange={(e) => setReturnDescription(e.target.value)}
                        required
                        rows={4}
                        disabled={submittingReturn}
                        placeholder="The more detail, the faster we can put it right."
                        className="field-input resize-none"
                      />
                    </div>

                    {/* Photographs of the trouble */}
                    <div>
                      <p className="field-label">Photos — optional, up to five</p>
                      <div className="flex flex-wrap gap-3">
                        {returnImageFiles.map((file, index) => (
                          <div key={index} className="group relative h-20 w-20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="h-full w-full border border-ink/15 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setReturnImageFiles(
                                  returnImageFiles.filter((_, i) => i !== index)
                                )
                              }
                              aria-label={`Remove photo ${index + 1}`}
                              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-parchment"
                            >
                              <X className="h-3 w-3" strokeWidth={2} />
                            </button>
                          </div>
                        ))}
                        {returnImageFiles.length < 5 && (
                          <label className="flex h-20 w-20 cursor-pointer items-center justify-center border border-dashed border-ink/30 text-ink/65 transition-colors hover:border-ink hover:text-ink">
                            <Plus className="h-5 w-5" strokeWidth={1.5} />
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageSelect}
                              disabled={submittingReturn}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button
                        type="button"
                        onClick={closeReturnDesk}
                        disabled={submittingReturn}
                        className="btn-ghost-ink flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submittingReturn}
                        className="btn-clay flex-1"
                      >
                        {submittingReturn ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                            Sending
                          </>
                        ) : (
                          "Submit request"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

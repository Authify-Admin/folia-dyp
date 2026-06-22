import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/PolicyPage";
import { POLICIES } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: POLICIES.shipping.dek,
};

export default function ShippingPage() {
  return <PolicyPage doc={POLICIES.shipping} />;
}

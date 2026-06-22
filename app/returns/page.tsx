import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/PolicyPage";
import { POLICIES } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: POLICIES.returns.dek,
};

export default function ReturnsPage() {
  return <PolicyPage doc={POLICIES.returns} />;
}

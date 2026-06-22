import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/PolicyPage";
import { POLICIES } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: POLICIES.privacy.dek,
};

export default function PrivacyPage() {
  return <PolicyPage doc={POLICIES.privacy} />;
}

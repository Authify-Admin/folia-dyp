"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { usePathname } from "next/navigation";

/**
 * Route-entry transition: each page settles in like a printed sheet
 * laid on the desk. (Admin routes opt out — they keep a plain shell.)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotionSafe();
  const pathname = usePathname();

  if (reduced || pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

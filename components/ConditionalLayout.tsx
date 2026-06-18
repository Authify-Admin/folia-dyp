"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollToTop } from "@/components/motion/ScrollToTop";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // The admin panel keeps a plain, utilitarian shell: no smooth scroll,
  // no storefront chrome, no cart drawer.
  if (isAdmin) {
    return <main>{children}</main>;
  }

  return (
    <SmoothScroll>
      <ScrollToTop />
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}

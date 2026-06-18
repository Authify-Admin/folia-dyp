"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";

/**
 * Admin chrome: a slim top bar around every dashboard page (the dashboard
 * cards handle section navigation, so a full sidebar was redundant). The
 * logo returns to the dashboard, sub-pages get a "Back to dashboard" link,
 * and sign-out is always one click away. Auth pages (/admin, /admin/create)
 * render bare — they have their own centered layout.
 */
export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();

  const isAuthPage = pathname === "/admin" || pathname.startsWith("/admin/create");
  if (isAuthPage) return <>{children}</>;

  const isDashboardHome = pathname === "/admin/dashboard";

  const logout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("adminAuth");
      sessionStorage.removeItem("adminData");
    }
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" aria-label="Admin dashboard" className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Folia" width={88} height={30} className="h-6 w-auto" priority />
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-slate-500">
                Admin
              </span>
            </Link>
            {!isDashboardHome && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1.5 border-l border-slate-200 pl-4 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">{children}</main>
    </div>
  );
}

import { Inter } from "next/font/google";
import { AdminChrome } from "@/components/admin/AdminChrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-admin" });

/**
 * Admin shell. The ROOT layout already provides <html>/<body>; this nested
 * layout must NOT render its own. It scopes the admin UI to Inter and wraps
 * every page in the sidebar chrome (which hides itself on the auth pages).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} text-slate-900`}>
      <AdminChrome>{children}</AdminChrome>
    </div>
  );
}

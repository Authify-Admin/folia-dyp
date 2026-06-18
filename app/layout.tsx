import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { Providers } from "./providers";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://myfolia.in"),
  title: {
    default: "Folia — Planting Simplified",
    template: "%s · Folia",
  },
  description:
    "Organic plant care, made by people who have spent decades with their hands in the soil. Vermicompost, potting mixes, bio-fertilizers and boosters — small batches, honest ingredients, delivered across India.",
  keywords: [
    "organic fertilizer",
    "vermicompost",
    "potting mix",
    "plant care",
    "urban gardening",
    "neem cake",
    "perlite",
    "Folia",
  ],
  authors: [{ name: "Folia" }],
  openGraph: {
    title: "Folia — Planting Simplified",
    description:
      "Organic plant care, made by people who have spent decades with their hands in the soil.",
    type: "website",
    locale: "en_IN",
    siteName: "Folia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Folia — Planting Simplified",
    description:
      "Organic plant care, made by people who have spent decades with their hands in the soil.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${karla.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}

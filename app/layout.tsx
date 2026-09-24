import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "./brand.css";
import "./experience.css";
import "./reference.css";
import { ShakyProvider } from "@/components/shaky-store";
import { ShakyChrome, ShakyFooter } from "@/components/shaky-chrome";
import { ShakyDialogs } from "@/components/shaky-dialogs";
import { LocationSection, NewsletterSection } from "@/components/shaky-footer-extras";

export const metadata: Metadata = {
  title: "Mr. Shaky Nutribar | Entrena. Come. Logra.",
  description: "Platos deliciosos, balanceados y listos cuando los necesitas.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {/* Wompi Widget: tokenizes card data client-side in Wompi's own iframe (Rule 12 — this
            app never receives raw card data). Loaded globally so the checkout form can open it. */}
        <Script src="https://checkout.wompi.co/widget.js" strategy="afterInteractive" />
        <ShakyProvider>
          <ShakyChrome />
          <main id="inicio">{children}</main>
          <LocationSection />
          <NewsletterSection />
          <ShakyFooter />
          <ShakyDialogs />
        </ShakyProvider>
      </body>
    </html>
  );
}

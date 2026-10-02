import type { Metadata } from "next";
import Script from "next/script";
import { ShakyProvider } from "@/components/shaky-store";
import { ShakyChrome, ShakyFooter } from "@/components/shaky-chrome";
import { ShakyDialogs } from "@/components/shaky-dialogs";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";
import "./sections.css";
import "./refinements.css";
import "./reference-update.css";
import "./reference-polish.css";
import "./bowl-update.css";
import "./drips.css";
import "./ui-polish.css";
import "./order-current.css";
import "./bowl-desktop.css";
import "./checkout-desktop.css";
import "./product-dialog.css";
import "./macro-desktop.css";
import "./my-orders.css";
import "./cart-sheet.css";
import "./home-legacy.css";

export const metadata: Metadata = {
  title: "Mr. Shaky Nutribar | Comida real para cada objetivo",
  description: "Explora el menú de Mr. Shaky, planifica tu pedido y únete a nuestra comunidad.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/assets/mark.webp",
    shortcut: "/assets/mark.webp",
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
        {/* Widget de Wompi: tokeniza la tarjeta en su propio iframe, esta app nunca ve el número. */}
        <Script src="https://checkout.wompi.co/widget.js" strategy="afterInteractive" />
        <ShakyProvider>
          <SiteChrome>
            <ShakyChrome />
          </SiteChrome>
          {children}
          <SiteChrome>
            <ShakyFooter />
          </SiteChrome>
          <ShakyDialogs />
        </ShakyProvider>
      </body>
    </html>
  );
}

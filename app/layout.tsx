import type { Metadata } from "next";
import "./globals.css";
import "./sections.css";
import "./refinements.css";
import "./reference-update.css";
import "./reference-polish.css";
import "./bowl-update.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}

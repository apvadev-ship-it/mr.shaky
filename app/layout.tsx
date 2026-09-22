import type { Metadata } from "next";
import "./globals.css";
import "./brand.css";
import "./experience.css";
import "./reference.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}

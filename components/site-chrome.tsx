"use client";
/**
 * El diseño original vive bajo `.home-legacy`, así que la barra y el pie
 * que compartimos en todo el sitio van envueltos en esa clase.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return <div className="home-legacy">{children}</div>;
}

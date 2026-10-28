import type { Metadata } from "next";
import { Caveat, Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Ninth Muse — Clarity Across Cultural & Global Divides",
  description:
    "Ninth Muse is a New York communications consultancy elevating policy messaging, mission-critical proposals and executive communications across languages and cultures.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} ${caveat.variable}`}>
      <body className="text-ink antialiased selection:bg-gold-light overflow-x-hidden">{children}</body>
    </html>
  );
}

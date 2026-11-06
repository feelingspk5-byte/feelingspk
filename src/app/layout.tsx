import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FEELINGS | Men's Unstitched Shalwar Kameez Fabric",
    template: "%s | FEELINGS",
  },
  description:
    "FEELINGS — premium men's unstitched shalwar kameez fabric. Traditional Pakistani luxury, Stone-led design.",
  metadataBase: new URL("https://feelings.local"),
  openGraph: {
    title: "FEELINGS",
    description:
      "Men's unstitched shalwar kameez fabric. Traditional Pakistani luxury.",
    type: "website",
    images: [
      {
        url: "/brand/feelings-logo.png",
        width: 1536,
        height: 1024,
        alt: "FEELINGS — Men's Unstitched Fabrics",
      },
    ],
  },
  icons: {
    icon: [{ url: "/brand/favicon.png", type: "image/png" }],
    apple: [{ url: "/brand/favicon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

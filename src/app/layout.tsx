import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
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
    default: "FEELINGS | Elite Men's Collection",
    template: "%s | FEELINGS",
  },
  description:
    "FEELINGS Elite Men's Collection — premium unstitched fabric, stitched shalwar kameez, and dress shirts.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://feelingspk.com"),
  ),
  openGraph: {
    title: "FEELINGS | Elite Men's Collection",
    description:
      "Quiet luxury for the modern gentleman — fabric, shalwar kameez, and dress shirts.",
    type: "website",
    images: [
      {
        url: "/brand/feelings-logo.png",
        width: 1200,
        height: 800,
        alt: "FEELINGS — Elite Men's Collection",
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
        {children}
      </body>
    </html>
  );
}

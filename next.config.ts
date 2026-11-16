import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Short TTL so fabric asset fixes (corrupt CDN frames) refresh quickly
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qzyimpzblmklstrzilry.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;

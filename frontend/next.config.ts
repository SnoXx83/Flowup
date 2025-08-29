import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Désactive le Dev Toolbar de Next.js
  devIndicators: {
    buildActivity: false,
  },
};

export default nextConfig;

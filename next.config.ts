import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */ reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tinytales.trendline.marketing",
        pathname: "/**", // أو يمكن تخصيصه حسب المسار الصحيح
      },
    ],
  },
};

export default nextConfig;

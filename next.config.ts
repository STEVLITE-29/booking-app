import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.bstatic.com",
        pathname: "/xdata/images/**",
      },
    ],

    domains: ["images.unsplash.com", "images.kiwi.com"],
  },
};

export default nextConfig;

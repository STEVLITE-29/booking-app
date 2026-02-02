import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // trailingSlash: true,
  // basePath: "/my-booking-app",
  // assetPrefix: "/my-booking-app/",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.bstatic.com",
        pathname: "/xdata/images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.kiwi.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

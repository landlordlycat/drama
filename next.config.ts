import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: false,
  cacheComponents: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

export default nextConfig

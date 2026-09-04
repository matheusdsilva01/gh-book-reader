import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typedRoutes: false,
  logging: {
    fetches: {
      fullUrl: true
    },
  },
  images: {
    unoptimized: true,
  }
}

export default nextConfig

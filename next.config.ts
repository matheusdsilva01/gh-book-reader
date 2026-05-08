import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typedRoutes: false,
  logging: {
    fetches: {
      fullUrl: true
    },
  }
}

export default nextConfig

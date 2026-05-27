/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.alboshop.com.ar",
          },
        ],
        destination: "https://alboshop.com.ar/:path*",
        permanent: true,
      },
    ]
  },
}

export default nextConfig

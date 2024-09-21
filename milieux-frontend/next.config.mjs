/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/ecomm",
        destination: `${process.env.ECOMM_FRONTEND_URL}/ecomm`,
      },
      {
        source: "/ecomm/:path+",
        destination: `${process.env.ECOMM_FRONTEND_URL}/ecomm/:path+`,
      },
    ];
  },
};

export default nextConfig;

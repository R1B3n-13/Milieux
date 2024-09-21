/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/ecomm",
  reactStrictMode: true,
  images: {
    domains: [
      "drive.google.com",
      "i.ibb.co",
      "res.cloudinary.com",
      "placehold.co",
      "encrypted-tbn0.gstatic.com",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb", // 2mb is the default
    },
  },
};

export default nextConfig;

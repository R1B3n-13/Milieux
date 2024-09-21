/** @type {import('next').NextConfig} */
// const nextConfig = {};
const nextConfig = {
  reactStrictMode: true,
  // dangerouslyAllowSVG: true,
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
      bodySizeLimit: "10mb", // 2mb is the default
    },
  },
};
  
export default nextConfig;

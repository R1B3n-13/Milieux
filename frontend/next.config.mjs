/** @type {import('next').NextConfig} */
// const nextConfig = {};
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['drive.google.com', 'i.ibb.co', 'res.cloudinary.com'],
      // domains: ['w7.pngwing.com'],
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '10mb', // 2mb is the default
      },
    },
  };
  
export default nextConfig;

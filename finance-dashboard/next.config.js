/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // keep for external image URLs
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

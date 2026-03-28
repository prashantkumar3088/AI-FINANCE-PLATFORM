/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // enables static HTML export for Firebase Hosting
  trailingSlash: true,
  images: {
    unoptimized: true, // required for static export
  },
};

export default nextConfig;

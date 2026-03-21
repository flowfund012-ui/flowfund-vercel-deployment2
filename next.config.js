/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: { domains: ['lh3.googleusercontent.com'], formats: ['image/avif','image/webp'] },
};
module.exports = nextConfig;

/** @type {import('next').NextConfig} */
// Build timestamp: 2026-04-14T08:00:00Z
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
};
module.exports = nextConfig;

/** @type {import('next').NextConfig} */
// Build: 2026-04-21T14:00:00Z
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
};
module.exports = nextConfig;

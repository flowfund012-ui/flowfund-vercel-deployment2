/** @type {import('next').NextConfig} */
// Build: 2026-04-13T20:00:00Z — force fresh Vercel build
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
};
module.exports = nextConfig;

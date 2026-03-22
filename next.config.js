/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
  compress: true,
  poweredByHeader: false,
  optimizePackageImports: ['chart.js'],
};

module.exports = nextConfig;

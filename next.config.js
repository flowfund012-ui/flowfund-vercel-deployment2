/** @type {import('next').NextConfig} */
// Build: v3.1 - WaveFlow logo, Academy, Vault, Language, BankSync
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
  generateBuildId: async () => 'ff-v3-1-waveflow',
};
module.exports = nextConfig;

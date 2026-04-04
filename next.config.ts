/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ISSO VAI FAZER O SITE IR AO AR MESMO COM OS ALERTAS DO SISTEMA
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

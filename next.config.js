/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // If your repo is not at the root domain, set the basePath and assetPrefix:
  basePath: '/Kansou',
  assetPrefix: '/Kansou/',
  // If you use images, add images.unoptimized:
  images: { unoptimized: true },
};

module.exports = nextConfig;
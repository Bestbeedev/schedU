import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* config options here */
};

const withPWA = require('next-pwa')({
  dest: 'public', // où seront générés les fichiers du service worker
  disable: process.env.NODE_ENV === 'development', // active PWA seulement en production
})

module.exports = withPWA(nextConfig)
export default nextConfig;



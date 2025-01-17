import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'docs.espressif.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.adafruit.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'static-cdn.m5stack.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-shop.adafruit.com',
      },
      {
        protocol: 'https',
        hostname: '*.lilygo.cc',
      },
      {
        protocol: 'https',
        hostname: 'resource.heltec.cn',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'heltec.org',
      },
      {
        protocol: 'https',
        hostname: 'docs.m5stack.com',
      },
    ],
  },
};

export default nextConfig;

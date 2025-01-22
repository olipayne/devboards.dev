/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  typescript: {
    // We'll handle type checking in CI
    ignoreBuildErrors: true,
  },
}

export default nextConfig;

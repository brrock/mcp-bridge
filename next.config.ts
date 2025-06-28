import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://claude.ai/**'),
      new URL('https://raw.githubusercontent.com/**'),
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

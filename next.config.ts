<<<<<<< HEAD
import type { NextConfig } from "next";
=======
import type { NextConfig } from 'next';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
<<<<<<< HEAD
      new URL("https://claude.ai/**"),
      new URL("https://raw.githubusercontent.com/**"),
=======
      new URL('https://claude.ai/**'),
      new URL('https://raw.githubusercontent.com/**'),
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
    ],
  },
};

export default nextConfig;

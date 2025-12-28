/** @type {import('next').NextConfig} */
const nextConfig = {images: {
    domains: ['res.cloudinary.com']
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Also ignore TS errors during build (often goes hand-in-hand with eslint errors)
    ignoreBuildErrors: true,
  }
};

export default nextConfig;

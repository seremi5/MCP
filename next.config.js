/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },

  // API routes configuration
  async rewrites() {
    return [
      // Optional: Add any URL rewrites here
    ];
  },

  // Headers configuration
  async headers() {
    return [
      {
        // Apply headers to all API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // Environment variables (optional)
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Build configuration
  typescript: {
    // Enable if you want to ignore TypeScript errors during build
    ignoreBuildErrors: false,
  },

  eslint: {
    // Enable if you want to ignore ESLint errors during build
    ignoreDuringBuilds: false,
  },

  // Image optimization (if you plan to use Next.js Image component)
  images: {
    domains: [
      // Add any external image domains here
      'example.com',
    ],
  },

  // Output configuration for Vercel
  output: 'standalone', // Uncomment if you need standalone output
};

module.exports = nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript strict checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize for production deployment
  experimental: {
    optimizePackageImports: ['pdfjs-dist', 'tesseract.js']
  },
  webpack: (config, { isServer }) => {
    // Fix for PDF.js worker and client-side dependencies
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
        fs: false,
      };
      
      // Optimize for large libraries
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
      };
    }
    
    return config;
  },
  // Headers for PDF.js worker and security
  async headers() {
    return [
      {
        source: '/pdf.worker.min.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

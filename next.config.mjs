/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // next/image acts as our image proxy + cache + resizer: it fetches the
    // Firebase Storage original once, then serves resized WebP/AVIF from
    // /_next/image and caches the optimized output for 30 days. Admin
    // thumbnails request small widths, so multi-MB originals never hit the UI.
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/story',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

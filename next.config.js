/** @type {import('next').NextConfig} */
const nextConfig = {
  // No trailing slashes on URLs (per docs/11-url-architecture.md)
  trailingSlash: false,

  // Strict React mode
  reactStrictMode: true,

  // Generate sitemap.xml and robots.txt via app routes -- not via this config
  // (we control them as code in app/sitemap.ts etc.)

  // 301 redirects enforcing canonical forms
  async redirects() {
    return [
      // Future: redirects for any legacy URLs from the static HTML era
      // Currently no redirects needed since the static site has no real URLs to preserve.
    ];
  },

  // Headers for SEO + security baseline
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

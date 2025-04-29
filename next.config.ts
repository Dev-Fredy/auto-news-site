/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { domains: ["cdn.sanity.io"] },
  experimental: { serverActions: true, edgeFunctions: true },
  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: "/api/sitemap" },
    ];
  },
};

export default nextConfig;
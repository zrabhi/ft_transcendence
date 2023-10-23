/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  reactStrictMode: false,
  // output: 'standalone',
  images: {
    domains: ['cdn.intra.42.fr', '10.11.5.6', '127.0.0.1', 'placehold.co', 'i.pravatar.cc', 'cdn.dribbble.com'],
  }
}

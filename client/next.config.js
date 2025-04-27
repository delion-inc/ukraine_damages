/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  images: {
    domains: ['93.127.131.80'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '93.127.131.80',
        port: '8080',
        pathname: '/api/**',
      },
    ],
  },
};

module.exports = nextConfig;

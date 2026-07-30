/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/ecommerce-product-images/**",
      },
      {
        protocol: "http",
        hostname: "minio.local",
        pathname: "/ecommerce-product-images/**",
      },
    ],
  },
};

module.exports = nextConfig;

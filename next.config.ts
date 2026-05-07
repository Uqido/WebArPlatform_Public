/** @type {import('next').NextConfig} */

// Check build for production
const isProd = process.env.NODE_ENV === "production";
const prefix = isProd ? "/WebArPlatform_Public" : "";

const nextConfig = {
  output: "export",
  allowedDevOrigins: ["*.trycloudflare.com"],
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: prefix,
  assetPrefix: prefix,
  env: {
    NEXT_PUBLIC_BASE_PATH: prefix,
  },
};

module.exports = nextConfig;

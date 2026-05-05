import type { NextConfig } from "next";

const normalizedBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "");
const basePath = normalizedBasePath && normalizedBasePath !== "/" ? normalizedBasePath : undefined;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  }
};

export default nextConfig;

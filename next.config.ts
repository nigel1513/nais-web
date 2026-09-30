import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // 외부 주소에서 개발 서버를 볼 때: DEV_ORIGINS=호스트1,호스트2 npm run dev
  allowedDevOrigins: process.env.DEV_ORIGINS?.split(",").filter(Boolean) ?? [],
};

export default nextConfig;

import type { NextConfig } from "next";

// GitHub Pages serves this site from /Portfolio. The deploy workflow passes
// that path in as PAGES_BASE_PATH; locally it is empty so `npm run dev` works at /.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;

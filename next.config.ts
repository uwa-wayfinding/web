import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // ✅ required for open-next
  // appDir: true,     // ✅ required if you're using App Router (app folder)
  // experimental: {
  //   typedRoutes: true
  // }
};

export default nextConfig;

// 👇 This is only for `next dev`, keep it
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ug174pc6c9eepvrr.public.blob.vercel-storage.com",
        port: "",
        pathname: "/resume_photos/**", //pathname: "/**"
      },
    ],
  },
};

export default nextConfig;

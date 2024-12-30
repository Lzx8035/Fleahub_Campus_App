import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "szlmetwvtwtkmsaupqaj.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      //   {
      //     protocol: "https",
      //     hostname: "api.dicebear.com",
      //     port: "",
      //     pathname: "/7.x/**",
      //   },
    ],
  },
};

export default nextConfig;

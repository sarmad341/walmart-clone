import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "links.papareact.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "i5.walmartimages.com",
      },
      {
        protocol: "https",
        hostname: "serpapi.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      // Google encrypted thumbnail domains
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn1.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn2.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn3.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn4.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn5.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn6.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn7.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn8.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn9.gstatic.com",
      },
    ],
  },
};
/* config options here */

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // /themes was folded into the style guide, which documents the same
        // tokens plus type and components. Permanent, so anything that linked
        // to the old URL follows once and updates.
        source: "/themes",
        destination: "/style-guide",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

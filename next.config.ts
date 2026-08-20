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
      {
        // The page is called Experience now. The URL was in the wild — it is on
        // the deployed site and may be in someone's tab — so it redirects
        // rather than 404ing.
        source: "/resume",
        destination: "/experience",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

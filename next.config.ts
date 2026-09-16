import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    // The Japanese construction landing page ships as a self-contained static
    // file in public/jp/. Next serves it at /jp/index.html; this makes /jp work.
    return [
      { source: "/jp", destination: "/jp/index.html" },
      // Alec's portfolio: static pages generated from
      // artifacts/scrollcraft/builds/alec-portfolio/ into public/alec/.
      { source: "/alec", destination: "/alec/index.html" },
      { source: "/alec/:slug", destination: "/alec/:slug/index.html" },
    ];
  },
  async redirects() {
    return [
      // v4 folded the eyecare page into the home page. Keep the old URLs
      // alive: /optometry was the link we handed to prospects.
      { source: "/optometry", destination: "/", permanent: true },
      { source: "/eyecare", destination: "/", permanent: true },
      // alecstephens.tech is the founder domain on this same project; its
      // front door is the portfolio. 302 for the first weeks, then 301.
      {
        source: "/",
        has: [{ type: "host", value: "alecstephens.tech" }],
        destination: "https://stephensai.co/alec",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    // The Japanese construction landing page ships as a self-contained static
    // file in public/jp/. Next serves it at /jp/index.html; this makes /jp work.
    return [
      { source: "/jp", destination: "/jp/index.html" },
      // Alec's portfolio: static per-build pages generated from
      // artifacts/scrollcraft/builds/alec-portfolio/ into public/alec/.
      // The /alec index moved to the app route (src/app/alec, the bench) on
      // 2026-09-23. The static public/alec/index.html is kept as the old
      // gallery, reachable at /alec/index.html.
      { source: "/alec/:slug", destination: "/alec/:slug/index.html" },
      // The full front desk case study: self-contained static page from
      // artifacts/case-studies/ in the vault, served on our own domain.
      {
        source: "/case-studies/front-desk-knowledge-base",
        destination: "/case-studies/front-desk-knowledge-base/index.html",
      },
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
      {
        source: "/",
        has: [{ type: "host", value: "www.alecstephens.tech" }],
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
      {
        // Last on purpose: when two rules set the same header, the later wins.
        // The QuickBooks callback carries a one-time code in its address:
        // never send it on as a referrer, never cache the page.
        source: "/qb/:path*",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;

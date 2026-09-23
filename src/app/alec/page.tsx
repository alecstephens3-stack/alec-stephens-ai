import type { Metadata } from "next";
import { BenchStage } from "@/components/bench/bench-stage";
import { SITE } from "@/components/bench";
import { SITE_URL } from "@/lib/content";

/**
 * /alec: Alec's bench, the portfolio on the desk engine (2026-09-23). Replaces
 * the static card gallery that public/alec/index.html served; that file stays
 * reachable at /alec/index.html. The per-build pages at /alec/<slug> are still
 * the static ones.
 */
export const metadata: Metadata = {
  title: { absolute: SITE.title },
  description: SITE.description,
  alternates: { canonical: `${SITE_URL}/alec` },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/alec`,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: "/og-image.png" }],
  },
};

export default function AlecPage() {
  return <BenchStage />;
}

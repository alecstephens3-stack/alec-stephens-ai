import type { Metadata } from "next";
import { HomeBody } from "@/components/sections/v7/home-body";
import { DepthHero } from "@/components/sections/v7/hero-depth";

/** Draft hero option (depth), for Alec to compare. Not linked, not indexed. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Preview() {
  return <HomeBody visual={<DepthHero />} />;
}

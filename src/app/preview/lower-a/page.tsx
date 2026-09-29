import type { Metadata } from "next";
import { HomeBody } from "@/components/sections/v7/home-body";
import { LowerA } from "@/components/sections/v7/lower-a";

/** Builder A's lower half ("Instruments"), for Alec to compare. Not linked, not indexed. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Preview() {
  return <HomeBody lower={<LowerA />} />;
}

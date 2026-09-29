import type { Metadata } from "next";
import { HomeBody } from "@/components/sections/v7/home-body";
import { LowerC } from "@/components/sections/v7/lower-c";

/** Builder C's lower half ("Working product"), for Alec to compare. Not linked, not indexed. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Preview() {
  return <HomeBody lower={<LowerC />} />;
}

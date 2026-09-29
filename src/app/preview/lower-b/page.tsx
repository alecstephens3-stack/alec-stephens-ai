import type { Metadata } from "next";
import { HomeBody } from "@/components/sections/v7/home-body";
import { LowerB } from "@/components/sections/v7/lower-b";

/** Builder B's lower half ("Drawn"), for Alec to compare. Not linked, not indexed. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Preview() {
  return <HomeBody lower={<LowerB />} />;
}

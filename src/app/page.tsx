import type { Metadata } from "next";
import { HomeBody } from "@/components/sections/v7/home-body";
import { SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export default function Home() {
  return <HomeBody />;
}

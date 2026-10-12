import type { Metadata } from "next";
import { HomeBody } from "@/components/sections/v7/home-body";
import { SITE_URL } from "@/lib/content";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
    // The home page in Korean lives at /kr (hreflang takes the language code, ko).
    languages: { en: SITE_URL, ko: `${SITE_URL}/kr`, "x-default": SITE_URL },
  },
};

export default function Home() {
  return <HomeBody />;
}

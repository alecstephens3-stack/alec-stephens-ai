import type { Metadata } from "next";
import { PlayStage } from "@/components/play/play-stage";

/**
 * /play: the sandbox. The front desk with toys on it and a game behind each
 * one. Built at the Yamagata Claude Build Day on 2026-09-23. Draft, unlinked,
 * noindex until Alec says otherwise.
 */
export const metadata: Metadata = {
  title: "The sandbox",
  description: "A desk with nothing to do. Find the toys with the glass, click one to play, throw the rest.",
  robots: { index: false, follow: false },
};

export default function PlayPage() {
  return <PlayStage />;
}

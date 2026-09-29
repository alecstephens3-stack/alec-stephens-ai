import type { Metadata } from "next";
import { DeskStage } from "@/components/desk/desk-stage";

/**
 * /desk: the front desk as a page. Built at the Yamagata Claude Build Day on
 * 2026-09-23. Draft, unlinked, noindex until Alec says otherwise.
 */
export const metadata: Metadata = {
  title: "The front desk",
  description:
    "A dental front desk seen from above. Every job on it is done by hand. Hover to bring one into focus, click to open the tool that does it.",
  robots: { index: false, follow: false },
};

export default function DeskPage() {
  return <DeskStage />;
}

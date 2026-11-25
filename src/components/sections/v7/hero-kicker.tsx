"use client";

import { useSyncExternalStore } from "react";

/**
 * The small label over the hero headline. Visitors who arrive through the
 * Medari partner link (syntegrityai.com/medari, which lands on
 * /?utm_source=medari) are mostly pharmacy owners from Curtis's email list,
 * so they read the pharmacy wording. Everyone else reads the normal label.
 * The page stays static: the address is read in the browser only.
 */
const subscribe = () => () => {};
const fromMedari = () =>
  new URLSearchParams(window.location.search).get("utm_source") === "medari";

export function HeroKicker({
  text,
  medariText,
}: {
  text: string;
  medariText?: string;
}) {
  const medari = useSyncExternalStore(subscribe, fromMedari, () => false);
  return <p className="t-label">{medari && medariText ? medariText : text}</p>;
}

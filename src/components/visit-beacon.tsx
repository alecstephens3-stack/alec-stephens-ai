"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Reports clicks from one page to another inside the site to the visit log.
 * The first page of a visit is not sent from here: the proxy already logged
 * it on the server, with the referrer and any campaign tag (src/proxy.ts).
 */
export function VisitBeacon() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (document.cookie.includes("sai_notrack=1")) return;
    const body = JSON.stringify({ path: pathname });
    if (!navigator.sendBeacon?.("/api/visit", body)) {
      fetch("/api/visit", { method: "POST", body, keepalive: true }).catch(
        () => {},
      );
    }
  }, [pathname]);

  return null;
}

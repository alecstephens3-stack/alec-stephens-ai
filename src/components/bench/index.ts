// No "use client" here on purpose: server components (the /alec page's
// metadata) import SITE from this barrel. BuildCard carries its own directive.
export { BuildCard } from "./build-card";
export { CASES, ABOUT, SITE } from "./cases";
export type { BuildCase, Figure, Site, About } from "./cases";

/**
 * Builder B ("Drawn"), 2026-09-29: every NEW visible string in this lower half,
 * in one place so it can be listed and copy-checked. Everything else on these
 * sections is imported verbatim from @/lib/content.
 *
 * Sources for the few that paraphrase approved copy:
 * - "Flat price, in writing", "Your practice software": V7_HOW steps 02 and 03.
 * - "Where the hours go": V7_CONTACT body ("find where the hours go").
 * - "Every change saved": FAQ ("Every change is saved and can be undone").
 * - "Not your charts", "Never on our servers", "Billing or claims": PATIENT.fine.
 * - "Owner", "Set up by": PATIENT.fine ("that we set up and you own").
 */

export const HOW_NOTES = [
  "Where the hours go",
  "Flat price, in writing",
  "Your practice software",
  "Every change saved",
] as const;

export const PATIENT_KICKER = "Patient data";

export const PATIENT_TABS = ["Most builds", "Billing or claims", "The BAA"] as const;

export const MAP_LABELS = {
  practice: "Your practice",
  us: "Us",
  binder: "Rules, prices, protocols",
  charts: "Patient charts",
  answers: "Front desk answers",
  account: "An account in your practice's name",
  servers: "Our servers",
  owner: "Owner",
  ownerValue: "Your practice",
  setUp: "Set up by",
  setUpValue: "Us",
  notCharts: "Not your charts",
  neverOurs: "Never on our servers",
  signed: "Signed before we start",
  baa: "BAA",
};

export const CLOCKS = {
  us: "Japan and Korea",
  you: "Central time",
  ahead: (h: number) => `We're ${h} hours ahead`,
};

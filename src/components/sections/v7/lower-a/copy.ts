/**
 * Builder A ("Instruments"), 2026-09-29. Every visible string this lower half
 * ADDS lives here, so the list in the report is this file. Everything else is
 * imported approved copy from @/lib/content, used word for word.
 */

export const A_PRICING = {
  build: "Build",
  monthly: "Monthly",
  moreQuestions: "More questions",
};

/**
 * The reader's own estimate (Charlie's calculator rules, 2026-09-29):
 * labelled as theirs, from their numbers; defaults are NOT the case study's
 * 4 questions and 10 minutes; days open per week is an input; hours, never
 * dollars; no promise wording. It measures the time the job takes now, not
 * time we would give back.
 */
export const A_ESTIMATE = {
  title: "Your own numbers",
  prompt: "Pick one job your staff repeat by hand.",
  times: "Times a day",
  minutes: "Minutes each time",
  days: "Days open a week",
  weeks: "Weeks in a year",
  total: "Your estimate",
  after: "a year on this one job, from your own numbers.",
  less: "Less",
  more: "More",
};

export const A_PATIENT = {
  kicker: "Patient data",
  switchLabel: "Where the data goes",
  states: [
    {
      key: "answers",
      tab: "Front desk answers",
      from: "Your rules, prices and protocols",
      home: "Front desk answers",
      homeNote: "Your staff search it.",
      never: "Your charts",
      cross: "Not in it",
    },
    {
      key: "billing",
      tab: "Billing or claims",
      from: "Patient data",
      home: "An account in your practice's name",
      homeNote: "You own it. We set it up.",
      never: "Our servers",
      cross: "Never",
    },
  ],
} as const;

export const A_CLOCK = {
  you: "Your clinic, Central time",
  us: "Us, Japan and Korea",
  hint: "Drag along the line to check another time.",
  now: "Now",
  back: "Back to now",
  noon: "Noon",
  midnight: "Midnight",
};

/**
 * The contact panel's three lines: the approved V7_CONTACT body, set as the
 * three things that happen. Same words; the third line opens "We send you"
 * where the paragraph read "and send you".
 */
export const A_CONTACT_LINES = [
  "Tell us about your week.",
  "We'll find where the hours go.",
  "We send you an Opportunity Map with the fix for each, yours to keep whether you hire us or not.",
];

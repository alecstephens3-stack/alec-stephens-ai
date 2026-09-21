/**
 * Site content, DRAFT v6 (the trimmed homepage, Sep 21 2026).
 *
 * v5 said each point four times in four card shapes: 1,527 visible words.
 * v6 says each thing once. Nothing here is new prose for its own sake; every
 * sentence is a cut-down of an approved v5 sentence, and every number was
 * already on the live page. Voice rules unchanged: plain language, no em
 * dashes, "tool" or "system" and never "AI" outside the company name, never
 * gender a staff role, we not I.
 *
 * What moved off the homepage and where it went is listed in
 * artifacts/homepage-trim-2026-09-21/CUTS.md.
 */

export const SITE_NAME = "Stephens AI";
export const SITE_URL = "https://stephensai.co";
export const CONTACT_EMAIL = "alec@stephensai.co";
export const SECOND_EMAIL = "jusheen@stephensai.co";
export const CALENDLY = "https://calendly.com/alecpstephens/30min";
export const CONTACT_EMAIL_JUSHEEN = "jusheen@stephensai.co";

// Shown on /privacy and /terms. Bump this whenever either page changes in
// substance, not for typo fixes.
export const LEGAL_UPDATED = "September 17, 2026";
export const CASE_STUDY_URL = "https://stephensai.co/case-studies/front-desk-knowledge-base";
export const LINKEDIN_URL = "https://www.linkedin.com/company/stephensai";

export const SITE_TAGLINE = "Custom office tools for independent clinics";

export const SITE_DESCRIPTION =
  "Your clinic runs on a few people who remember everything. Stephens AI puts what they know into a tool the whole office can use, built from your own documents. Custom office tools for independent healthcare clinics.";

export const NAV_LINKS = [
  { label: "Case study", href: "/#proof" },
  { label: "How we work", href: "/#how" },
  { label: "FAQ", href: "/faq" },
];

export const HERO = {
  kicker: "For independent healthcare clinics",
  headline: {
    lead: "Your clinic runs on a few people who",
    accent: "remember everything.",
  },
  sub: "When they're busy or out, the answers go with them. We put what they know into one tool the whole office can use, built from your own documents, and take the repetitive jobs off their plate.",
  primaryCta: { label: "Talk to us", href: CALENDLY },
  slotLabel: "Hero visual",
};

export const QUOTE = {
  kicker: "Wichita Family Vision · Wichita, Kansas",
  title: {
    lead: "Every front desk question used to land on the office manager.",
    accent: "Now the answer is one search away.",
  },
  problem:
    "\u201cWhich doctor can see this patient?\u201d \u201cDo we collect for this or bill it?\u201d Whoever was on the phone walked it over to the office manager's desk.",
  text: "This is highly valuable, both in the short term and long term. It's already saving a lot of time.",
  who: "Jill Romines",
  role: "Front Office Manager",
  stat: {
    big: "~200 hours a year",
    rest: "back at the front desk. An estimate, from the clinic's own numbers.",
  },
  since: "In daily use since August 2026.",
};

/**
 * The one demonstration on the page: the live front desk app answering a real
 * question. Trimmed from v5 (the window chrome, the nav pills and two of the
 * chips are gone) because they were words on screen that carried no argument.
 */
export const DEMO = {
  app: "Front Desk",
  heading: "What's happening on the call?",
  query: "vision plan, medical complaint",
  chips: ["Red eye call", "Price of an exam"],
  resultTitle: "Refraction: collect or bill?",
  resultTag: "Protocol",
  resultBody:
    "The vision plan covers the refraction only when the visit bills as a routine exam.",
  resultRule:
    "If the visit bills medical, the refraction is not covered. Collect at checkout.",
  resultMeta: "Last edited by the office manager",
  tools: [
    { label: "Which doctor can see this patient", icon: "doctor" },
    { label: "This year's price", icon: "price" },
    { label: "Collect or bill", icon: "bill" },
    { label: "How urgent is the call", icon: "pulse" },
  ],
  caption:
    "The live app, with the clinic's prices and rules left out. Staff type what's happening and get the protocol, with the exception called out.",
} as const;

export const PROOF_LINKS = {
  full: { label: "Read the full case study", href: CASE_STUDY_URL },
  more: "More, one page each:",
  items: [
    { label: "Time off and payroll", href: "/case-studies/time-off-and-payroll.pdf" },
    { label: "Vendor bills", href: "/case-studies/vendor-bills.pdf" },
    { label: "Admin tools", href: "/case-studies/admin-tools.pdf" },
  ],
};

export const HOW = {
  title: "How a project goes.",
  steps: [
    { n: "01", title: "A short call", body: "Tell us the job that eats your week." },
    { n: "02", title: "We watch the job", body: "A screen share with whoever does it today, then a flat price in writing." },
    { n: "03", title: "Build with your staff", body: "From your own documents. About two weeks." },
    { n: "04", title: "Yours to keep", body: "Your office manager edits it. Export it whenever you want." },
  ],
};

/**
 * The patient-data answer, in plain sight at reading size. The wording is the
 * approved one (no by default, yes when the job needs it, in your own cloud
 * account under a BAA), cut down from the v5 FAQ answer. The legal detail sits
 * beneath it, quieter but never hidden.
 */
export const PATIENT = {
  headline:
    "Patient information: none by default, and when a job does need it, the system runs inside your own cloud account under a BAA.",
  fine: "The knowledge base holds none of it: your rules, prices and protocols, not your charts. For work that does involve patient data, like billing or claims, the data stays with you and never sits on our servers. We sign a BAA before we start either way.",
};

export const FOUNDERS_SECTION = {
  title: "It's the two of us.",
};

export const FOUNDERS = [
  {
    name: "Alec Stephens",
    role: "Co-founder",
    image: "/images/headshot.png",
    bio: "Spent the past year inside an eyecare practice, watching how a front desk gets through a day.",
  },
  {
    name: "Jusheen Kim",
    role: "Co-founder",
    image: "/images/headshot-jusheen.png",
    bio: "Studied computer science at UC Berkeley, then was a lead software engineer at J.P. Morgan.",
  },
];

export const FAQ_SECTION = {
  kicker: "Common questions",
  title: "A few questions you'll probably have.",
  summary:
    "The questions clinics ask us on the first call, answered before you spend one.",
};

export const FAQ = [
  {
    q: "Does any patient information go into this?",
    a: "Only when the job calls for it. The knowledge base holds none: it's your rules, prices, and protocols, not your charts. For work that does involve patient data, like billing or claims, the system runs inside your own cloud account under a BAA, so the data stays with you and never sits on our servers. We sign a BAA before we start either way.",
  },
  {
    q: "Do we have to write the content ourselves?",
    a: "No. You share the documents you already have, as they are. We read through them, figure out what's current and what's stale, write the pages, and check each one with your office manager before it goes in.",
  },
  {
    q: "Does it matter what practice software we use?",
    a: "No. Most of what we build sits alongside your practice software rather than inside it, so it works with whatever you have. If a job does need to connect to your system, we scope that with you on the first call.",
  },
  {
    q: "Who keeps it up to date after launch?",
    a: "Your office manager, right inside the tool. Every change is saved and can be undone with one click. If you'd rather we go through it with your office manager every so often, that's what the monthly support is for.",
  },
  {
    q: "How long until staff are using it?",
    a: "About two weeks to go live. Your team is involved early on, so by launch it's answering the questions they were already asking.",
  },
  {
    q: "Is this only for the front desk?",
    a: "No. It started there because that's where the interruptions were. Any role with rules people carry in their heads works the same way.",
  },
  {
    q: "What does it cost?",
    a: "One flat fee for the build, quoted in writing after the first call. Monthly support is optional. No hourly billing and no long-term contract.",
  },
  {
    q: "Does our IT company have to do anything?",
    a: "No. There's nothing for them to install. It opens in a browser, doesn't need admin rights, and nothing on your server changes.",
  },
];

export const CONTACT = {
  kicker: "Book a call",
  title: "Bring one thing your clinic does by hand.",
  body: "Tell us about the job, and we'll tell you whether we can fix it and roughly what it would take.",
  bookLabel: "Talk to us",
};

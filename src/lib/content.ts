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

export const SITE_TAGLINE = "Less busywork for clinics, dental and eye care practices";

export const SITE_DESCRIPTION =
  "We find where your practice loses hours to work done by hand, then build software that does it, around the tools you already use. Get started with a free discovery call.";

export const NAV_LINKS = [
  { label: "Knowledge base", href: "/#knowledge-base" },
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
  /**
   * The 200 hours moved up here, onto the first screen, and came OUT of the
   * proof section. It is said once, and the word estimate is in the sentence
   * rather than in a footnote. 200 is final.
   */
  proof: {
    lead: "About 200 hours a year back at one Kansas clinic's front desk.",
    caveat: "An estimate, from the clinic's own numbers.",
  },
  /** The plain statement, at reading size, the moment the pin lets go. */
  statement:
    "We put what they know into a knowledge base the whole office can search, built from your own documents.",
  statementSub:
    "When they're busy or out, the answers go with them. We take the repetitive jobs off their plate too.",
  primaryCta: { label: "Talk to us", href: CALENDLY },
};

export const QUOTE = {
  kicker: "Case Study · Wichita Family Vision",
  title: {
    lead: "Every question used to go through one person.",
    accent: "Now anyone working at the front desk finds the answer in seconds.",
  },
  problem:
    "\u201cWhich doctor can see this patient?\u201d \u201cDo we collect for this or bill it?\u201d Questions like these came up all day, and each one meant putting a patient on hold and pulling the office manager away from their own work.",
  text: "This is highly valuable, both in the short term and long term. It's already saving a lot of time.",
  who: "Jill Romines",
  role: "Front Office Manager",
  since: "In daily use since August 2026.",
  /** The payoff, from portfolio.md (200 hours is final; always with its label). */
  payoff: [
    { n: "About 200 hours", l: "a year back at the front desk" },
    { n: "About $4,500", l: "a year in front desk pay" },
  ],
  payoffNote: "Estimated from the clinic's own numbers.",
  status: "Live in production",
};

/**
 * The one demonstration on the page: the live front desk app answering a real
 * question. Trimmed from v5 (the window chrome, the nav pills and two of the
 * chips are gone) because they were words on screen that carried no argument.
 */
export const DEMO = {
  /**
   * The lead-in names the link out loud: the sticky note in the hero
   * illustration asks this exact question, and this is the answer.
   */
  kicker: "What we built",
  title: "The note on the desk, answered.",
  lead: "Refraction: collect or bill? Here is what the front desk sees now.",
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
  // Alec, 2026-09-29: simplified to a slim strip after Services (headline/fine
  // stay for the frozen /preview/lower-* pages only).
  label: "Patient data",
  points: [
    "We sign a BAA before we start.",
    "Most of what we build never touches patient data.",
    "When it does, it stays in an account in your practice's name.",
  ],
  headline:
    "We sign a BAA before we start. Most of what we build never sees patient information.",
  fine: "The front desk answers hold your rules, prices and protocols, not your charts. When a job does need patient data, like billing or claims, it runs in an account in your practice's name that we set up and you own, never on our servers.",
};

// Alec, 2026-09-29: "Meet the founders"; never mention Japan, Korea or time zones.
export const FOUNDERS_SECTION = {
  title: "Meet the founders",
  note: "Every system is built by the two of us, from the first call to the monthly check-in.",
};

export const FOUNDERS = [
  {
    name: "Alec Stephens",
    role: "Co-founder",
    image: "/images/headshot.png",
    bio: "Built the front desk answers, time off and bills tools at a Kansas eye clinic, working with its office manager and bookkeeper.",
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
    a: "Your office manager, right inside the knowledge base. Every change is saved and can be undone with one click. If you'd rather we go through it with your office manager every so often, that's what the monthly support is for.",
  },
  {
    q: "How long until staff are using it?",
    a: "About 30 days for one build. Your team is involved early on, so by launch it's answering the questions they were already asking.",
  },
  {
    q: "Is this only for the front desk?",
    a: "No. It started there because that's where the interruptions were. Any role with rules people carry in their heads works the same way.",
  },
  {
    q: "What does it cost?",
    a: "Three flat prices: $4,500, $7,500 or $20,000 for the build, then $399, $699 or $1,499 a month. Your free discovery call tells you which fits. The monthly fee is our guarantee that everything we build keeps doing its job. No hourly billing and no long-term contract.",
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

/* ════════════════════════════════════════════════════════════════════════
   DRAFT v7 homepage (Sep 28 2026). Healthcare first, not only the knowledge
   base. Orgo-style clarity: a short headline, the real tools moving calmly in
   one window, a still logo row, the free time audit as the one ask, the price
   card on the page. Numbers: the combined 260 to 300 hours is the WFV figure
   approved 2026-09-25 (portfolio.md), always with its "estimated" label.
   ════════════════════════════════════════════════════════════════════════ */

export const V7_NAV = [
  { label: "Services", href: "/#work" },
  { label: "Work with us", href: "/#how" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Founders", href: "/#about" },
  { label: "FAQ", href: "/faq" },
];

// Alec, 2026-09-29: "Get started" everywhere; never "time audit" on the site.
export const V7_CTA = { label: "Get started", short: "Get started", href: CALENDLY };

export const V7_HERO = {
  kicker: "For independent healthcare practices",
  headline: { lead: "Less busywork.", accent: "More time for patients." },
  /** Word for word from the Medari partners-page line sent to Curtis 2026-09-25 (Alec, 2026-09-28). */
  sub: "We diagnose where practices can save time and increase profit, then build the solutions that get them there.",
  secondary: { label: "See our services", href: "/#work" },
  proof: "About 260 to 300 hours a year back at one Kansas eye clinic, from two builds.",
  proofCaveat: "Estimated from the clinic's own numbers.",
};

/** The window in the hero: three real tools, drawn with names and prices left out. */
export const V7_WINDOW = {
  caption:
    "Based on our systems in production. Names and amounts are examples.",
  tabs: [
    {
      id: "answers",
      label: "Front desk answers",
      short: "Answers",
      query: "vision plan, medical complaint",
      title: "Refraction: collect or bill?",
      body: "The vision plan covers the refraction only when the visit bills as a routine exam.",
      rule: "If the visit bills medical, collect at checkout.",
      meta: "Last edited by the office manager",
    },
    {
      id: "bills",
      label: "Vendor bills",
      short: "Bills",
      title: "This week's bills",
      rows: [
        { vendor: "Lens lab", amount: "$1,284.60", to: "Lab fees" },
        { vendor: "Frame supplier", amount: "$642.00", to: "Optical inventory" },
        { vendor: "Office supplies", amount: "$89.47", to: "Supplies" },
        { vendor: "Internet service", amount: "$129.99", to: "Utilities" },
      ],
      done: "4 bills in QuickBooks, filed and ready to pay",
    },
    {
      id: "timeoff",
      label: "Time off",
      short: "Time off",
      title: "Time off request",
      who: "Front desk",
      when: "Friday, half day",
      balance: "32 hours left this year",
      steps: ["Approved", "On the calendar", "In this week's payroll report"],
    },
  ],
} as const;

export const V7_LOGOS = {
  label: "Partners",
  items: [
    { name: "Wichita Family Vision", src: "/logos/wfv.png", w: 232, h: 96, size: 46 },
    { name: "Workthentic", src: "/logos/workthentic.png", w: 209, h: 96, size: 44 },
    { name: "Kamata Koumuten", src: "/logos/kamata.png", w: 543, h: 96, size: 32 },
    { name: "Medari Advisors", src: "/logos/medari.png", w: 239, h: 96, size: 44 },
    { name: "Tri-Valley Dental Care", src: "/logos/trivalley.png", w: 723, h: 96, size: 26 },
  ],
};

export const V7_WORK = {
  kicker: "Services",
  title: "Your staff can focus on patients. We handle the rest.",
  items: [
    {
      title: "Front desk answers",
      body: "Every rule, price and exception in one place staff can search, kept current by your office manager. Systems live in production from Kansas to California.",
      link: { label: "Case study", href: CASE_STUDY_URL },
    },
    {
      title: "Bills into QuickBooks",
      body: "Invoices read, filed and entered straight into QuickBooks through our own app, approved by Intuit. Your bookkeeper checks them instead of typing them.",
      link: { label: "One-page summary", href: "/case-studies/vendor-bills.pdf" },
    },
    {
      title: "Time off and payroll",
      body: "For practices still on paper slips or a spreadsheet: requests, approvals, the calendar and the payroll report in one place.",
      link: { label: "One-page summary", href: "/case-studies/time-off-and-payroll.pdf" },
    },
    {
      title: "Systems built around your practice",
      body: "Whatever your office needs, we build it, from setting up AI workflows for everyday admin work to complete, HIPAA compliant systems that connect to your EHR and work with patient records. We stay on to keep things running as your practice changes.",
    },
  ],
};

export const V7_HOW = {
  kicker: "Work with us",
  title: "Simple on purpose.",
  // Alec, 2026-09-29: three steps, no numbers. Discover is his line; Deliver and
  // Optimize are Charlie's finish of his drafts. `n` is an id only (never rendered).
  steps: [
    {
      n: "01",
      title: "Discover",
      body: "This part is free. We work together to find where we can get your practice the best results, and you get to keep our analysis regardless of the next steps.",
      shows: "See the Opportunity Map",
    },
    {
      n: "02",
      title: "Deliver",
      body: "We take the results from our analysis and build the solutions that give your team hours back, around the tools you already use. A flat price, in writing.",
      shows: "See the build",
    },
    {
      n: "03",
      title: "Optimize",
      body: "Once it's live, we keep it running and keep making it better, month to month. It stays yours.",
      shows: "See it running",
    },
  ],
};

// Alec, 2026-09-29: new card ($4,500 / $7,500 / $20,000 + $399 / $699 / $1,499), tiers renamed
// Foundation / Growth / Partner, one-line headline. `slug` tags each tier's booking link.
export const V7_PRICING = {
  kicker: "Pricing",
  title: "A plan for every practice.",
  tiers: [
    {
      name: "Foundation",
      slug: "foundation",
      price: "$4,500",
      monthly: "then $399 a month",
      lead: "Your biggest pain point, solved.",
      body: "We find the one problem costing your practice the most time and fix it, live in about 30 days.",
    },
    {
      name: "Growth",
      slug: "growth",
      price: "$7,500",
      monthly: "then $699 a month",
      lead: "Your two biggest problems, solved.",
      body: "Two builds, plus your team trained on Claude or ChatGPT to handle the paperwork that slows them down.",
      note: "What we'd suggest for most practices.",
    },
    {
      name: "Partner",
      slug: "partner",
      price: "$20,000",
      monthly: "then $1,499 a month",
      lead: "A technology team, without the hires.",
      body: "Everything in Growth, plus custom software wherever it pays for itself and working time with both of us every month.",
    },
  ],
  // Alec, 2026-09-29. "Deliver" is anchored to the written agreement, the same
  // standard the terms warrant ("performs as described in the proposal").
  guarantee: {
    lead: "If we don't deliver,",
    accent: "you get your money back.",
    sub: "Guaranteed. What we'll build is agreed in writing before we start, and if it doesn't do what we agreed, you don't pay for it.",
  },
  fine: "The monthly fee is our guarantee: everything we build keeps doing its job, and if it stops, we fix it. No long-term contract. Cancel any time and your content stays yours.",
};

export const V7_CONTACT = {
  kicker: "Get started",
  title: "30 minutes. You keep the map.",
  body: "Tell us about your week. We'll find where the hours go and send you an Opportunity Map with the fix for each, yours to keep whether you hire us or not.",
  bookLabel: "Get started",
};

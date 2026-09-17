/**
 * Site content, v5 (the office-manager homepage, Sep 2026). One file so copy
 * can be edited without touching layout. Voice rules: plain language, no em
 * dashes, no invented numbers, "tool" or "system" and never "AI" outside the
 * company name, never gender a staff role. Every number here traces to Alec's
 * published case study (stephens-ai-front-desk-case-study.vercel.app).
 *
 * Positioning is healthcare clinics in general. The eyecare detail appears
 * only as the case-study clinic.
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
  { label: "What we fix", href: "/#day" },
  { label: "Case studies", href: "/#proof" },
  { label: "How we work", href: "/#how" },
  { label: "FAQ", href: "/#faq" },
];

export const HERO = {
  kicker: "For independent healthcare clinics",
  headline: {
    lead: "Your clinic runs on a few people who",
    accent: "remember everything.",
  },
  sub: "When they're busy or out, the answers go with them. Stephens AI takes what they know and puts it into one tool the whole office can use, built from your own documents. We also take the repetitive jobs off their plate, so your staff can spend their time on the work only people can do.",
  primaryCta: { label: "Talk to us", href: CALENDLY },
  secondaryCta: { label: "See what we built", href: "/#proof" },
  result: {
    big: "~200 hours a year",
    rest: "back at one clinic's front desk. Estimated from the clinic's own numbers.",
  },
  trustLine:
    "It sits alongside your practice software, holds no patient information, and we sign a BAA before we start.",
};

export const QUOTE = {
  kicker: "From the front desk at Wichita Family Vision",
  text: "This is highly valuable, both in the short term and long term. It's already saving a lot of time.",
  who: "Jill Romines",
  role: "Front Office Manager",
  where: "Wichita Family Vision · Wichita, Kansas",
  chips: ["About 200 hours a year back", "In daily use since Aug 2026"],
};

export const DAY = {
  title: "A day at the clinic is a long list of small jobs.",
  lede: "Greet the patient, check the insurance, quote the price, book the follow-up, chase the bill. Most offices have never written the whole list down, and honestly most don't need to. When we sit down with a clinic we sort the list into three piles. The front desk is where we started. The same tool holds the technicians\', optical, and billing rules too.",
  columns: [
    {
      tag: "01 · A person keeps",
      title: "Only a person can do these",
      items: ["The exam", "Calming a nervous kid", "Calling a patient about a result"],
      note: "We don't build anything for these, and we wouldn't want to.",
    },
    {
      tag: "02 · Made faster",
      title: "Someone in the building already knows the answer",
      items: [
        "The insurance question mid-call",
        "Which doctor can see this patient",
        "Training the new hire",
      ],
      note: "We put that answer where anyone on the desk can find it in a few seconds.",
    },
    {
      tag: "03 · Off the plate",
      title: "These have a right answer every time",
      items: [
        "Typing the same numbers into a second system",
        "Filing paperwork in the right folder",
        "Building the same report every period",
      ],
      note: "So a program can do them, and a person checks the result.",
    },
  ],
  foot: {
    strong: "We start with one job.",
    rest: "For most clinics it's something in the middle pile. Here's what that looked like at one of them.",
  },
};

export const PROOF = {
  kicker: "Case study · Wichita Family Vision, Wichita, Kansas",
  title: {
    lead: "Every front desk question used to land on the office manager.",
    accent: "Now the answer is one search away.",
  },
  stats: [
    {
      value: "~200",
      unit: "hours a year",
      label: "Front desk time back. Estimated from the clinic's own numbers; a measured figure is coming.",
    },
    {
      value: "~$15,000",
      unit: "a year",
      label: "Fewer interruptions, and new hires trained in weeks instead of months.",
    },
    {
      value: "35",
      unit: "pages, 4 tools",
      label: "Rewritten from the clinic's own files, checked one by one with the front office manager.",
    },
    {
      value: "0",
      unit: "patient records",
      label: "Nothing about patients goes in it, by design. In daily use since August 2026.",
    },
  ],
  before: {
    title: "What was happening",
    body: [
      "“Which doctor can see this patient?” “Do we collect for this or bill it?” Whoever was on the phone ended up at the office manager's desk. The answers lived in 15 spreadsheet tabs, a scheduling document, a per-doctor rulebook and the office manager's memory. A question on a live call meant ten minutes of digging or a patient on hold. A new hire took about six months before the questions stopped, and four price lists sat stacked in one sheet with nobody sure which one was live.",
    ],
  },
  after: {
    title: "What we built",
    body: [
      "One tool that's open on every front desk screen. We rewrote 35 protocol pages from the clinic's own files (scheduling, insurance, charges, recall, triage, the daily checklist) and built four small decision tools for the questions anyone can get wrong: which doctor can see this patient, what this year's price is, whether to collect or bill, and how urgent the call is. Two managers can edit any page themselves, with a history of every change and one-click undo. Staff sign in with their clinic email, there's no patient information in it, and it runs on hosting the clinic owns.",
    ],
  },
  mock: {
    app: "Front Desk",
    nav: ["Home", "Tools", "Browse"],
    heading: "What's happening on the call?",
    query: "vision plan, medical complaint",
    chips: ["Red eye call", "Book a new patient", "Price of an exam", "Run recall"],
    resultTitle: "Refraction: collect or bill?",
    resultTag: "Protocol",
    resultBody:
      "The vision plan covers the refraction only when the visit bills as a routine exam.",
    resultRule:
      "If the visit bills medical, the refraction is not covered. Collect at checkout.",
    resultMeta: "Last edited by the office manager · one-click undo",
    tools: [
      { label: "Which doctor can see this patient", icon: "doctor" },
      { label: "This year's price", icon: "price" },
      { label: "Collect or bill", icon: "bill" },
      { label: "How urgent is the call", icon: "pulse" },
    ],
    caption:
      "Based on the live app, with the clinic's prices and rules left out. Staff type what's happening on the call and get the protocol, with the exception called out.",
  },
  footnote: {
    lead: "How we got the numbers.",
    body: "About four questions a day that used to take ten minutes of digging now take one search. That is about 200 hours a year, roughly $4,500 in pay. Then shorter training: the clinic said a new hire took about six months to learn the job. Cut that in half for two or three hires a year and that is another $8,000 to $12,000. Both are estimates from the clinic's own numbers, kept on the low side.",
  },
  ctaPrimary: { label: "Read the full case study", href: CASE_STUDY_URL },
  ctaSecondary: { label: "Download the PDF", href: "/case-studies/front-desk-knowledge-base.pdf" },
};

/**
 * The PDF shelf under the front desk case study. One page each, built from
 * scratchpad/pdfkit/build.py. Only the front desk study names its clinic; these
 * use plain descriptors and never claim to be separate clients.
 */
export const CASE_STUDIES = {
  title: "More case studies",
  lede: "One page each: the old way, what we built, and how we got the numbers.",
  linkLabel: "Open the PDF",
  items: [
    {
      title: "Time off and payroll",
      context: "Independent healthcare practice",
      from: "15 to 20 min",
      to: "~1 min",
      unit: "per request",
      summary: "Staff ask from their phones, the manager approves in one tap, and a payroll sheet shows up every other Monday.",
      status: "Live since spring 2026",
      tone: "good",
      pdf: "/case-studies/time-off-and-payroll.pdf",
      thumb: "/case-studies/time-off-and-payroll-thumb.webp",
    },
    {
      title: "Vendor bills",
      context: "Independent clinic",
      from: "",
      to: "~1¢",
      unit: "to read each bill",
      summary: "Bills get read, renamed and filed into the right vendor folder after one review. Nothing moves until someone clicks Go.",
      status: "Rolling out, September 2026",
      tone: "warn",
      pdf: "/case-studies/vendor-bills.pdf",
      thumb: "/case-studies/vendor-bills-thumb.webp",
    },
    {
      title: "Admin tools",
      context: "Multi-department practice",
      from: "5 hand edits",
      to: "1 click",
      unit: "to cancel a request",
      summary: "A menu inside the office's own sheet for the exceptions: missed days, new hires, departures and cancellations.",
      status: "Live since May 2026",
      tone: "good",
      pdf: "/case-studies/admin-tools.pdf",
      thumb: "/case-studies/admin-tools-thumb.webp",
    },
  ],
} as const;

export const HOW = {
  title: "How a project goes.",
  steps: [
    {
      n: "01",
      title: "A short call",
      body: "Tell us about the job that eats up your week. We'll tell you whether we can fix it and roughly what it would take.",
    },
    {
      n: "02",
      title: "We watch the job",
      body: "We do a screen share with whoever does the job today, then write up what we'd change, what we'd leave alone, and what it would cost. It's a flat fee, and you have it in writing before anything starts.",
    },
    {
      n: "03",
      title: "Build and test with your staff",
      body: "We build from your own documents and show your team early, so what goes live matches how they work. Plan on about two weeks.",
    },
    {
      n: "04",
      title: "Yours to keep",
      body: "Your office manager can change it, and you can export everything whenever you want. If you'd like us to stay on and keep it current, that's a month-to-month arrangement.",
    },
  ],
  guardrails: [
    {
      title: "Patient records",
      body: "Nothing we build reads a chart. Claims and chart work stay where they are, and if the problem you bring us lives in there, we'll tell you on the first call. We sign a BAA before we start regardless.",
    },
    {
      title: "Your IT company stays",
      body: "There's nothing for them to install. It opens in a browser, doesn't need admin rights, and nothing on your server changes.",
    },
    {
      title: "What it costs",
      body: "One flat fee for the build, quoted in writing after the first call. Monthly support is optional. No hourly billing and no long-term contract.",
    },
  ],
};

export const FOUNDERS_SECTION = {
  title: "It's the two of us.",
  lede: "You'll be talking to the people who build it, from the first call on.",
};

export const FOUNDERS = [
  {
    name: "Alec Stephens",
    role: "Co-founder",
    image: "/images/headshot.png",
    bio: "Alec spent the past year working inside an eyecare practice, on site and remote, watching how the front desk gets through a day. Most of what we build for clinics started there.",
  },
  {
    name: "Jusheen Kim",
    role: "Co-founder",
    image: "/images/headshot-jusheen.png",
    bio: "Jusheen studied computer science at UC Berkeley and was a lead software engineer at J.P. Morgan before this. He builds the things that have to keep working every day, and has done that for healthcare practices and software companies.",
  },
];

export const FAQ_SECTION = {
  kicker: "Common questions",
  title: "A few questions you'll probably have.",
};

export const FAQ = [
  {
    q: "Does any patient information go into this?",
    a: "No. Everything we build sits alongside your practice software and holds no patient records. We sign a BAA before we start regardless.",
  },
  {
    q: "Do we have to write the content ourselves?",
    a: "No. You share the documents you already have, as they are. We read through them, figure out what's current and what's stale, write the pages, and check each one with your office manager before it goes in.",
  },
  {
    q: "Does it matter what practice software we use?",
    a: "No. Nothing we build reads or writes to your chart or scheduling system, so it works alongside whatever you have.",
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
];

export const CONTACT = {
  kicker: "Book a call",
  title: "Bring one thing your clinic does by hand.",
  body: "It's a short call. Tell us about the job, and we'll tell you whether we can fix it and roughly what it would take. Even if we're not the right fit, you'll probably leave with an idea or two.",
  bookLabel: "Talk to us",
};

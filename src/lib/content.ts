/**
 * Site content, v4 ("clinics"). One file so copy can be edited without
 * touching layout. Voice rules: no em dashes anywhere in client-facing
 * copy, no invented statistics, no tool names in buyer-facing lines.
 *
 * Every number below traces to a source:
 *  - the leak model  -> artifacts/pricing-knowledge-base-and-enablement-2026-08-01.html
 *  - the price card  -> same file, section 06
 *  - WFV specifics   -> clients/WFV/wfv-core.md
 */

export const SITE_NAME = "Stephens AI";
export const SITE_URL = "https://stephensai.co";
export const CONTACT_EMAIL = "alec@stephensai.co";
export const CALENDLY = "https://calendly.com/alecpstephens/30min";

export const SITE_DESCRIPTION =
  "We build independent eyecare practices a searchable front desk system that holds every insurance rule, price, and protocol the team keeps in their heads. Live in a 27-person clinic. Contains zero patient data.";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "The Playbook", href: "/#playbook" },
  { label: "Proof", href: "/#proof" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

/* ------------------------------------------------------------------ hero */

export const HERO = {
  headline: {
    lead: "When your best front desk person leaves,",
    accent: "the way your clinic runs",
    tail: "shouldn't leave with her.",
  },
  sub: "We build independent eyecare practices a searchable front desk system that holds every insurance rule, price, and protocol your team currently keeps in their heads. It is live in a 27 person practice today. Their office manager updates it herself.",
  primaryCta: { label: "See what it costs", href: "/#pricing" },
  secondaryCta: { label: "Book a 20 minute call", href: CALENDLY },
  trustLine:
    "Contains zero patient data. BAA signed before we touch anything.",
};

/* --------------------------------------------------------------- problem */

export const PROBLEMS = [
  {
    kicker: "Go ask the manager",
    title: "Every hard question routes through one person",
    body: "Six times a day someone puts a patient on hold and walks to the office manager's desk. Two people stop working. The answer was always written down somewhere, just not anywhere findable while a patient waits on the line.",
  },
  {
    kicker: "Four price lists, one spreadsheet",
    title: "Nobody is sure which price is current",
    body: "This is not hypothetical. It is what we found at the practice we built this for. When the answer is ambiguous the front desk guesses, and the guess shows up later as an uncollected refraction or a surprise balance at checkout.",
  },
  {
    kicker: "Six months to useful",
    title: "New hires learn by interrupting the people who know",
    body: "Turnover at the front desk is normal. Losing six months of ramp every time is not. The knowledge is real, it just lives in three heads and a binder nobody has updated since the last insurance change.",
  },
];

/* --------------------------------------------------------------- product */

export const PLAYBOOK_FEATURES = [
  {
    title: "Every situation, written down and searchable",
    body: "Your protocols turned into short situation pages your team can find mid call. Not a document library. One search box and an answer in under ten seconds.",
  },
  {
    title: "Decision tools for the calls that go wrong",
    body: "The handful of decisions that actually cost money get their own tools instead of a paragraph: urgency triage, which doctor can see this patient, collect or bill the refraction, and the current year price. The tool forces the buried exception open so nobody has to remember it exists.",
  },
  {
    title: "Your office manager edits it",
    body: "A price changes, she changes it, and it is live. No ticket, no waiting on us, no version drift. Every edit is versioned so a wrong change is one click back.",
  },
  {
    title: "Only your staff get in",
    body: "Sign in with the practice Google Workspace account your team already has. Nobody outside your domain can open it, and only the people you name can edit.",
  },
  {
    title: "Installs on the front desk machines",
    body: "It sits on the taskbar and opens like any other app. It keeps working through a slow connection, which matters more at a front desk than anything else on this list.",
  },
  {
    title: "Staff report a problem in one tap",
    body: "When something is wrong or missing, the person who found it says so from inside the app. You see it. At the practice we built this for, the first four reports were fixed the same day.",
  },
];

/* ----------------------------------------------------------------- proof */

export const PROOF = {
  kicker: "Wichita, Kansas",
  title: "A 27 person independent practice, three doctors, one location",
  body: [
    "We spent a year inside this clinic. Not on calls. In the office, at the front desk, watching the work. The playbook came out of a 76 situation map we built by reading their actual corpus and sitting with the people who answer the phone.",
    "Before we touched it there were four price lists stacked in one spreadsheet. Time off ran on green paper slips that got handed across a desk and sometimes lost.",
  ],
  quote: {
    text: "Highly valuable. It will save a lot of time.",
    attribution: "Front office manager, on first use",
  },
  stats: [
    { value: "76", label: "Front desk situations mapped" },
    { value: "4", label: "Decision tools replacing guesswork" },
    { value: "60 to 100", label: "Admin hours a year returned by the time off build" },
    { value: "0", label: "Patient records in the system" },
  ],
};

/* ------------------------------------------------------------- the leak */

export const LEAK = {
  title: "What the gap is costing you",
  intro:
    "A mid size independent practice, roughly 27 staff and three doctors. Every line below is deliberately conservative, because the number has to survive your office manager reading it back to you.",
  lines: [
    {
      label: "Uncollected refraction and non covered services",
      amount: 7800,
      note: "Two a week missed at $75. At 30 refractions a day that is a 0.3% error rate.",
    },
    {
      label: "Mis booked or wasted appointment slots",
      amount: 10400,
      note: "One unrecoverable slot a week at $200, exam plus optical attach.",
    },
    {
      label: "Claim denials traced to the front desk",
      amount: 3360,
      note: "Eight a month at $35 of rework. Excludes anything eventually written off.",
    },
    {
      label: "Onboarding ramp",
      amount: 4800,
      note: "Two front desk hires a year, three months of ramp removed each.",
    },
    {
      label: "The interruption tax",
      amount: 4400,
      note: "Six a day, eight minutes of combined time, 250 days. The go ask the manager line.",
    },
  ],
  total: 30760,
  footnote:
    "This is the conservative model. At realistic volumes it lands between $50,000 and $65,000. These are modeled figures using your practice's shape, not measured results from your clinic. We will build the real version with your numbers on the call.",
};

/* --------------------------------------------------------------- pricing */

export const PRICING_TIERS = [
  {
    name: "Front Desk Playbook",
    setup: "$4,500",
    monthly: "$299",
    monthlyBasis: "per month",
    summary:
      "Your front desk knowledge, curated and searchable, kept true by your manager.",
    features: [
      "Up to 30 situation pages, written by us from your corpus",
      "4 decision tools",
      "Search, in app editing, revision history",
      "Google Workspace sign in, editor permissions you control",
      "Staff feedback loop",
      "Installs on the front desk machines",
    ],
    highlighted: false,
  },
  {
    name: "Practice Playbook",
    setup: "$9,500",
    monthly: "$499",
    monthlyBasis: "per month",
    summary:
      "The whole floor, not just the front desk. Technicians, optical, and doctor restriction rules.",
    features: [
      "Everything in Front Desk Playbook",
      "Up to 70 pages and 6 decision tools",
      "Technician, optical, and doctor restriction coverage",
      "Role based views so each seat sees its own work",
      "Quarterly accuracy review with your manager",
      "Written AI use policy for your staff",
    ],
    highlighted: true,
    badge: "Most practices land here",
  },
  {
    name: "Practice Operating System",
    setup: "$18,000",
    monthly: "$899",
    monthlyBasis: "per month",
    summary:
      "The playbook plus the operational builds around it, and us on the hook every month.",
    features: [
      "Everything in Practice Playbook",
      "Time off and payroll automation",
      "Practice Intelligence Snapshot",
      "Monthly office hours with both founders",
      "Priority on new builds",
    ],
    highlighted: false,
  },
];

export const PRICING_NOTES = [
  "Additional sections beyond the page cap are $600 each.",
  "Additional location is $1,500 setup and $149 per month.",
  "Clinical content publishes only after doctor sign off, always.",
  "We count your corpus before we fix a price on the two larger tiers. A blind fixed price on clinic wide content is underwater before it starts.",
];

/* -------------------------------------------------------------- timeline */

export const TIMELINE = [
  {
    week: "Week 1",
    title: "We read everything you already have",
    body: "Your protocol docs, your price sheets, your insurance notes, the binder. We count it and tell you honestly whether it is a 30 page build or a 70 page build before you commit to a number.",
  },
  {
    week: "Week 2",
    title: "We sit with the people who answer the phone",
    body: "The situation map comes from your front desk, not from a template. This is the step other vendors skip and it is the reason the thing gets used.",
  },
  {
    week: "Weeks 3 and 4",
    title: "Build, then break it in front of you",
    body: "You get a working version to poke holes in. The first practice told us we had it wrong in four places and we fixed all four the same day.",
  },
  {
    week: "Day 30",
    title: "Live at the front desk",
    body: "Installed on the machines, your manager trained on editing, and the feedback loop open. Our first build took five weeks because we rebuilt it twice after the front desk told us it was wrong. Yours benefits from that.",
  },
];

/* ------------------------------------------------------------ what you own */

export const OWNERSHIP = [
  {
    q: "Who owns the content",
    a: "You do. They are your practice's rules. We wrote them down, we do not own them.",
  },
  {
    q: "Can you export it",
    a: "Yes, any time, as plain files you can open without us. Ask and we send it, no charge.",
  },
  {
    q: "What if we cancel",
    a: "Monthly, cancel any time, no term. You keep the exported content. The hosted app stops.",
  },
  {
    q: "What if you two disappear",
    a: "You have the export and the content is readable without our software. We would rather say this out loud than have you find out it was never true.",
  },
];

/* ------------------------------------------------------------------- faq */

export const FAQ = [
  {
    q: "Does any patient data go into this?",
    a: "No. The playbook holds your rules, not your charts: insurance policies, pricing, scheduling protocols, procedures. There is no patient record in it, which means there is nothing in it to breach. If a later project does touch patient data, it runs inside your own accounts under a signed BAA, never on our infrastructure. We sign the BAA before we touch anything either way.",
  },
  {
    q: "Do we have to write all the content ourselves?",
    a: "No, and this is the main difference between us and a training platform. Trainual and Whale hand you an empty system at $249 to $300 a month and you still have to write every page. We write the pages from the material you already have, then hand you the keys so your manager keeps them current.",
  },
  {
    q: "What if our practice management system isn't Compulink?",
    a: "The playbook does not connect to your practice management system, so it does not matter. That is deliberate. Most hosted practice management systems, Compulink Advantage Cloud included, do not give an outside vendor database access. Any vendor promising you a nightly sync into a hosted system is either overselling or has not asked yet.",
  },
  {
    q: "Who actually keeps it up to date?",
    a: "Your office manager, in the app, in about ten seconds. That is what the monthly fee protects. A knowledge base that goes stale becomes the exact problem it was built to solve, so the recurring line pays for keeping it true, not for hosting.",
  },
  {
    q: "How long until staff are actually using it?",
    a: "Live at day 30. Adoption is a separate question and we treat it that way: the feedback button and the same day fixes in the first two weeks are what turn it from a tool you bought into a tool they open.",
  },
  {
    q: "Who are we actually hiring?",
    a: "Two people. Alec Stephens and Jusheen Kim, and you will work with both of us, not an account manager. We are based in Asia, which means we are not sitting at a desk during your morning rush. Urgent issues get answered by the next business morning your time, and we will tell you the escalation path in writing before you sign anything. We would rather state the limit than imply a promise we cannot keep.",
  },
  {
    q: "Why not just build this ourselves?",
    a: "Some practices should. If you have someone in house with the time to interview the front desk, curate 30 to 70 situation pages, build the decision tools, and keep it current, you do not need us. What you are buying is that nobody in your building has to spend the next three months on it.",
  },
];

/* -------------------------------------------------------------- founders */

export const FOUNDERS = [
  {
    name: "Alec Stephens",
    role: "Co founder",
    image: "/images/headshot.png",
    bio: "Spent the last year inside a 27 person eyecare practice, in the office, watching the front desk work. Most of what we build for clinics came out of that. Five plus years and a 100% job success score on Upwork before this.",
  },
  {
    name: "Jusheen Kim",
    role: "Co founder",
    image: "/images/headshot-jusheen.png",
    bio: "Former lead software engineer at J.P. Morgan. Builds the systems that have to hold up under real use, and has worked with healthcare practices, solo operators, and software companies.",
  },
];

/* ------------------------------------------------------- outside eyecare */

export const OTHER_WORK = [
  {
    title: "Business coaching practice",
    body: "A complete operating system: agents handling inbox, scheduling, voice note capture, meeting notes, and calendar to invoice.",
    metric: "5 agents running her operations",
  },
  {
    title: "Construction company, Japan",
    body: "Full site rebuild across six pages, search console, and a corrected business profile. Now on an upkeep retainer.",
    metric: "Complete digital rebuild",
  },
  {
    title: "Language test prep company",
    body: "AI integrated across curriculum drafting, formatting, review cycles, and process automation.",
    metric: "80% of manual work cut",
  },
];

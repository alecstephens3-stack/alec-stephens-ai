import type { OptometryModule, OptometryStat } from "@/types";

export const OPTOMETRY_HERO = {
  eyebrow: "00 · Eyecare",
  headline: {
    before: "AI systems built for ",
    accent: "independent",
    after: " eyecare practices.",
  },
  lede:
    "We build intelligence layers on top of the software you already use. Compulink, RevolutionEHR, Crystal PM, Nextech. Your clinic stops losing time to paperwork, and revenue to bad workflows. HIPAA-eligible. Deployed in weeks, not months.",
  ledeHighlight: "on top of the software you already use.",
  primaryCta: { label: "Book a 20-minute call", href: "/#contact" },
  secondaryCta: { label: "See how it works", href: "#flagship" },
  trust: [
    "HIPAA-eligible",
    "BAA before data access",
    "Compulink",
    "RevolutionEHR",
    "Crystal PM",
    "Nextech",
  ],
};

export const OPTOMETRY_PROBLEM_STATS: OptometryStat[] = [
  {
    value: "20 hrs/week",
    valueAccent: "20",
    caption: "Front-desk time burned on calls and portals that don't touch a patient.",
    highlight: "don't touch a patient.",
  },
  {
    value: "Tuesday 9 PM",
    valueAccent: "9 PM",
    caption: "When most prospective patients are searching for an eye doctor. Your phone is off.",
    highlight: "Your phone is off.",
  },
  {
    value: "4 weeks late",
    valueAccent: "4",
    caption: "When most owners notice a problem started. By then it's a month of lost revenue.",
    highlight: "a month of lost revenue.",
  },
];

export const OPTOMETRY_PROBLEM_CLOSER =
  "Independent eyecare practices aren't failing because owners don't work hard. They're failing because the software they pay for wasn't built to help them run the business. We fix that.";

export const OPTOMETRY_FLAGSHIP = {
  eyebrow: "02 · Flagship",
  headline: {
    before: "Know what's working. Every ",
    accent: "Monday",
    after: ", in your inbox.",
  },
  body: [
    "Your PM system collects everything. Every patient, every exam, every charge. It just doesn't tell you what any of it means.",
    "Stephens AI pulls that data every night and turns it into a weekly briefing that takes 90 seconds to read. You see the numbers that actually move an eyecare practice: optical capture rate, recall compliance, no-show rate, average revenue per patient, new-patient mix, AR days. You see what's trending up, what's slipping, and what's costing you money this week, all in plain language with specific recommendations.",
    "Open it with your Monday morning coffee. Run your week.",
  ],
  videoCaption: "Dashboard walkthrough · 16 sec loop",
  videoEmbedSrc: "/prototypes/optometry-dashboard/index.html",
  videoPoster: "/images/optometry/dashboard-poster.svg",
  mondayBriefImage: "/images/optometry/monday-brief.svg",
  mondayBriefFallback: {
    from: "Stephens AI",
    subject: "Week in review",
    date: "Mon, Apr 20, 2026, 7:03 AM",
    body: [
      "Last week at Wichita Family Vision: 142 patients, up 6% from the 4-week average. Optical conversion was 64%, down 4 points, worth investigating. 3 no-shows, in line with trend. Recall compliance at 71%.",
      "Top concern this week: Tuesday no-show rate has trended up 3 weeks running. Now 12% versus the 4% clinic average.",
      "Top opportunity: 47 patients are currently overdue for recall, representing roughly $18,800 in potential revenue if recovered.",
      "Recommended focus: review Tuesday scheduling. Are confirmations going out on schedule?",
    ],
  },
  howItWorks:
    "Nightly sync from your PM system, warehoused in your dedicated encrypted database, AI-generated narrative briefing, delivered by email and accessible via web dashboard anytime.",
};

export const OPTOMETRY_MODULES: OptometryModule[] = [
  {
    number: "01",
    title: "Booking Guardian",
    problem:
      "Online schedulers book appointments that don't fit your schedule. Staff reschedules manually. Patients get annoyed.",
    solution:
      "Every booking gets validated against provider availability, equipment, insurance, and staffing rules before it commits. Bad bookings re-route via SMS in under 60 seconds.",
    howItWorks: [
      "Validates every booking against 8 clinic rules",
      "Auto-rebooks conflicts via SMS",
      "Pulls waitlist patients into cancellation openings",
    ],
    roi: {
      lead: "Prevents ",
      highlight: "15 to 20 scheduling errors per month",
      trail: " for a 3-doctor practice. Each one costs 20+ minutes of staff recovery.",
    },
  },
  {
    number: "02",
    title: "Recall & Reactivation",
    problem:
      "Generic recall blasts from Demandforce and Weave work for maybe 5% of overdue patients. The other 95% is revenue walking out the door.",
    solution:
      "Behavioral segmentation and multi-channel outreach that actually gets lapsed patients back through the door. Personalized, not blasted.",
    howItWorks: [
      "Segments every patient by recall status",
      "Sends personalized SMS, email, and voice at the right cadence",
      "Tracks revenue attribution down to the patient",
    ],
    roi: {
      lead: "For a 3-doctor practice, recovering 20% of overdue patients returns ",
      highlight: "$30,000 to $40,000 per year",
      trail: " in visits already owed.",
    },
  },
  {
    number: "03",
    title: "Reputation & Reviews",
    problem:
      "Happy patients don't leave Google reviews. Unhappy ones do. Your Google ranking is your patient acquisition.",
    solution:
      "After each visit we route happy patients to Google and unhappy patients to your office manager before they post publicly. AI drafts responses to every incoming review in your voice.",
    howItWorks: [
      "Smart SMS routing after each visit",
      "One-tap review posting for happy patients",
      "Service-recovery alerts with AI-drafted responses for human approval",
    ],
    roi: {
      lead: "Routing review requests at the right moment typically produces ",
      highlight: "3 to 5× more Google reviews",
      trail: " over six months based on industry benchmarks. Higher ratings follow, local ranking improves, more patients find you.",
    },
  },
  {
    number: "04",
    title: "Insurance Verification",
    problem:
      "Front desk burns 10 to 20 minutes per patient verifying benefits through portals and phone trees. Medical and vision eligibility both slow the morning down.",
    solution:
      "Pre-appointment verification runs automatically 48 hours ahead. Staff walks in to pre-verified appointments and a flagged exception queue.",
    howItWorks: [
      "Medical eligibility via clearinghouse API",
      "Vision portal verification available as premium scope",
      "Exception alerts with writeback to the patient record",
    ],
    roi: {
      lead: "Reclaims ",
      highlight: "8 to 12 front-desk hours per week",
      trail: ". Most day-of insurance surprises disappear.",
    },
  },
];

export const OPTOMETRY_CONNECTION = {
  eyebrow: "04 · How they fit",
  headline: {
    before: "Five modules. ",
    accent: "One",
    after: " system.",
  },
  body:
    "Weave and Demandforce are point tools that don't talk to each other. Stephens AI is a connected operating layer. Every module reads from and writes to the same patient data layer. Recall knows who Booking Guardian just scheduled. The Dashboard tracks how each module is performing. You aren't buying five tools. You're building one system that compounds every month it runs.",
};

export const OPTOMETRY_CTA = {
  eyebrow: "● Booking · Q2 2026 · 3 slots",
  headline: {
    line1: "Your front desk.",
    line2: "Their Monday mornings.",
    accent: "Back.",
  },
  body:
    "Discovery calls are 20 minutes. We learn your practice, your stack, and your biggest friction points. No pitch, no pressure. You leave with at least one idea you can act on even if you never hire us.",
  primary: { label: "Book a 20-minute call", href: "/#contact" },
  secondary: { label: "alec@stephensai.co", href: "mailto:alec@stephensai.co" },
};

export const OPTOMETRY_META = {
  title: "AI for independent eyecare practices",
  description:
    "Stephens AI builds HIPAA-eligible intelligence layers on top of Compulink, RevolutionEHR, Crystal PM, and Nextech. Booking Guardian, Recall & Reactivation, Insurance Verification, Reviews, and a Monday-morning Practice Intelligence Dashboard. Deployed in weeks.",
  path: "/optometry",
};

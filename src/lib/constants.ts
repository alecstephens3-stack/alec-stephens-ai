import type {
  CaseStudy,
  NavLink,
  Solution,
} from "@/types";

export const SITE_NAME = "Stephens AI";
export const SITE_URL = "https://stephensai.co";
export const CONTACT_EMAIL = "alec@stephensai.co";
export const SITE_DESCRIPTION =
  "AI consultants who find where businesses lose time and money, then fix it with custom AI systems. Custom internal software, agentic workflows, and full AI operating systems for teams in the US, Japan, and beyond.";

export const NAV_LINKS: NavLink[] = [
  { label: "Eyecare", href: "/optometry" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/#about" },
];

export const SERVICES = [
  {
    title: "AI Strategy & Audits",
    description:
      "We analyze your operations, find the highest-ROI opportunities, and deliver a prioritized roadmap with clear cost savings. Diagnosis before prescription.",
    details: ["Operations analysis", "Cost-of-status-quo breakdown", "Prioritized roadmap", "Branded PDF deliverable"],
  },
  {
    title: "Custom Builds & Automation",
    description:
      "End-to-end systems: AI agents wired into your real tools, custom internal software, and workflow automation that runs multi-step processes on its own. Built on Claude, n8n, Apps Script, and full-stack code.",
    details: ["Agentic AI workflows", "Custom internal software", "Tool & API integrations", "Video walkthrough & docs"],
  },
  {
    title: "AI App Development",
    description:
      "Full-stack applications with Claude and OpenAI built in. From concept to production, scoped to solve one specific problem well.",
    details: ["Next.js + TypeScript", "AI API integrations", "Database design", "Deployment on Vercel"],
  },
];

export const SOLUTIONS: Solution[] = [
  {
    title: "Instant Lead Response",
    problem: "",
    roiHook:
      "Speed wins deals. When a lead hears back in seconds instead of hours, far more of them convert. The system replies day or night.",
    industries: ["Dental", "HVAC", "Law Firms", "Real Estate", "Home Services"],
    icon: "bolt",
  },
  {
    title: "Document Processing",
    problem: "",
    roiHook:
      "Cut processing time and drop data-entry errors close to zero. The work that ate afternoons happens quietly in the background.",
    industries: ["Accounting", "Insurance", "Law", "Logistics", "Construction"],
    icon: "document",
  },
  {
    title: "Follow-up Sequences",
    problem: "",
    roiHook:
      "Most revenue is lost to silence, not rejection. Consistent, automatic follow-up brings back the deals that would have quietly slipped away.",
    industries: ["Coaches", "Consultants", "Agencies", "B2B Services", "SaaS"],
    icon: "refresh",
  },
  {
    title: "Customer Revival",
    problem: "",
    roiHook:
      "Your past customers are your cheapest growth. A reactivation campaign brings lapsed buyers back through the door with no new ad spend.",
    industries: ["Gyms", "Dental", "E-commerce", "SaaS", "Coaching"],
    icon: "database",
  },
  {
    title: "Status Reports & Alerts",
    problem: "",
    roiHook:
      "The least exciting automation on the list. Also the one no business gives up once they have it.",
    industries: ["Agencies", "Construction", "Sales Teams", "E-commerce", "Professional Services"],
    icon: "chart",
  },
];

export const PRICING_TIERS = [
  {
    name: "AIOS Install Sessions",
    price: "$250",
    basis: "per session, or $1,000 for 5",
    description: "The on-ramp. We install your AI operating system together over five working sessions. You own the build; we bring the tool fluency. Your business stops being bottlenecked by you.",
    features: [
      "Five 1-hour working sessions",
      "A working AIOS your agents can read",
      "Plain-English, fully yours",
      "Surfaces what's worth building next",
    ],
    cta: "Start here",
    highlighted: false,
  },
  {
    name: "AI Business Audit",
    price: "$500 – $1,500",
    basis: "one-time",
    description: "Diagnose before prescribing. We map your operations, find the leaks, and deliver a prioritized roadmap with ROI estimates.",
    features: [
      "Full operations analysis",
      "Cost-of-status-quo breakdown",
      "Prioritized roadmap",
      "Branded PDF report",
      "Follow-up strategy call",
    ],
    cta: "Book the audit",
    highlighted: false,
  },
  {
    name: "AI Implementation",
    price: "$2,000 – $15,000",
    basis: "fixed price",
    description: "We build the system. Custom software, agentic workflows, and integrations, scoped to your highest-impact opportunity.",
    features: [
      "Everything in the Audit",
      "Custom software, not templates",
      "Agentic & workflow builds",
      "Complete video walkthrough",
      "30-day bug support guarantee",
    ],
    cta: "Let’s build",
    highlighted: true,
  },
  {
    name: "Transformation Retainer",
    price: "$2,000 – $4,000",
    basis: "per month",
    description: "Your ongoing AI partner. We continuously audit, build, and improve your systems as the business evolves.",
    features: [
      "Everything in Implementation",
      "Ongoing optimization",
      "New builds every month",
      "Priority support",
      "Quarterly strategy reviews",
    ],
    cta: "Let’s talk",
    highlighted: false,
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    title: "Independent Optometry Clinic",
    description:
      "A 27-person eyecare practice ran time-off and payroll entirely on paper: handwritten request slips, manual balance tracking, payroll prepped by hand every period. We built them a full custom system on Google Workspace. A simple form feeds an engine that tracks balances, posts approvals to a shared calendar, notifies staff, and generates the payroll report automatically each pay period. All 26 employee records migrated, anniversary-based accrual, weekend-aware math, verified by a 22-check test suite.",
    tags: ["Google Apps Script", "Custom Software", "Healthcare", "Payroll Automation"],
    metric: "60–100 hrs",
    metricLabel: "Admin returned per year",
    images: [
      { src: "/images/case-studies/wfv/pto-system.svg", alt: "Custom PTO and payroll system: request, approval, and auto-generated payroll report" },
    ],
  },
  {
    title: "Business Coaching Practice",
    description:
      "A solo founder doing all her own inbox triage, scheduling, task capture, meeting notes, and invoice prep by hand. We built her a complete AI operating system: a team of agents that handle email, scheduling replies, voice-note-to-task capture, and meeting notes, plus an automated calendar-to-invoice workflow. A central brain document keeps every agent on her voice and editable in plain English. Now she reviews instead of doing.",
    tags: ["Claude API", "AI Agents", "ClickUp", "Voice-to-Task"],
    metric: "5 agents",
    metricLabel: "Running her operations",
    images: [
      { src: "/images/case-studies/workthentic/aios-system.svg", alt: "AI operating system control panel: five autonomous agents and a central brain document" },
    ],
  },
  {
    title: "Construction Company, Japan",
    description:
      "A construction company with 60+ years of excellent work and no way to show it. We rebuilt and redesigned their site (six pages, mobile and desktop), set up Google Search Console, and corrected their Google Business Profile so search finally points to the right place. The result: a modern live site, proper search presence, an ongoing upkeep retainer, and word-of-mouth referrals to other businesses.",
    tags: ["Next.js", "SEO", "Web Design", "Google Business"],
    metric: "Complete",
    metricLabel: "Digital transformation",
    images: [
      { src: "/images/case-studies/kamata/kamata-website.png", alt: "Construction company redesigned website" },
    ],
  },
  {
    title: "Language Test-Prep Company",
    description:
      "An education company builds OPIC speaking-test curriculum for Korean professionals. Their team produced everything by hand, spending hours on tasks AI handles in minutes. We integrated AI across their workflow: curriculum drafting, content formatting, review cycles, and process automation. Roughly 80% of the manual work is now handled by AI.",
    tags: ["Claude API", "AI Integration", "Process Automation", "EdTech"],
    metric: "80%",
    metricLabel: "Manual work cut",
    images: [
      { src: "/images/case-studies/kiwiopic/platform.png", alt: "Online test-preparation learning platform" },
    ],
  },
  {
    title: "Stephens AI — our own operations",
    description:
      "We don’t just build AI systems for clients. We run our own consulting business on one. Autonomous agents handle client briefs, research, meeting intelligence, reporting, and daily operations. We test everything we build on ourselves before it ever reaches a client.",
    tags: ["Claude Code", "n8n", "Telegram", "PostgreSQL"],
    metric: "24/7",
    metricLabel: "Self-operating business",
    images: [
      { src: "/images/case-studies/aios/dashboard.png", alt: "AIOS Mission Control dashboard showing clients, revenue, and automation health" },
    ],
  },
];

export const TECH_STACK = [
  "Claude API",
  "n8n",
  "Apps Script",
  "Next.js",
  "TypeScript",
  "PostgreSQL",
  "Prisma",
  "Vercel",
];

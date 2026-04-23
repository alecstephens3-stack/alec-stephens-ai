import type {
  CaseStudy,
  NavLink,
  Solution,
} from "@/types";

export const SITE_NAME = "Stephens AI";
export const SITE_URL = "https://stephensai.co";
export const CONTACT_EMAIL = "alec@stephensai.co";
export const SITE_DESCRIPTION =
  "AI automation consultant helping businesses in the USA, Japan, and around the world save time with n8n workflows, Claude API integrations, and custom automation solutions.";

export const NAV_LINKS: NavLink[] = [
  { label: "Optometry", href: "/optometry" },
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
      "I analyze your operations, find the highest-ROI automation opportunities, and deliver a prioritized roadmap with clear cost savings.",
    details: ["Operations analysis", "Cost-of-status-quo breakdown", "Prioritized AI roadmap", "Branded PDF deliverable"],
  },
  {
    title: "AI Workflow Automation",
    description:
      "End-to-end agentic workflows: AI agents connected to your real tools that execute multi-step processes autonomously. Built on n8n, Claude API, and custom integrations.",
    details: ["Agentic AI workflows", "Custom n8n workflows", "Tool integrations", "Video walkthrough & documentation"],
  },
  {
    title: "AI App Development",
    description:
      "Full-stack applications with Claude and OpenAI integrations. From concept to production, built to solve a specific problem.",
    details: ["Next.js + TypeScript", "AI API integrations", "Database design", "Deployment on Vercel"],
  },
];

export const SOLUTIONS: Solution[] = [
  {
    title: "Instant Lead Response",
    problem: "",
    roiHook:
      "Businesses that respond in under 5 minutes are 10x more likely to close the deal.",
    industries: ["Dental", "HVAC", "Law Firms", "Real Estate", "Home Services"],
    icon: "bolt",
  },
  {
    title: "Document Processing",
    problem: "",
    roiHook:
      "Cut processing time by 80% and drop data entry errors to near zero.",
    industries: ["Accounting", "Insurance", "Law", "Logistics", "Construction"],
    icon: "document",
  },
  {
    title: "Follow-up Sequences",
    problem: "",
    roiHook:
      "Consistent follow-up sequences can double your conversion rate on existing leads.",
    industries: ["Coaches", "Consultants", "Agencies", "B2B Services", "SaaS"],
    icon: "refresh",
  },
  {
    title: "Customer Revival",
    problem: "",
    roiHook:
      "Reactivation campaigns average 1,200% ROI in the first 60 days. No new ad spend required.",
    industries: ["Gyms", "Dental", "E-commerce", "SaaS", "Coaching"],
    icon: "database",
  },
  {
    title: "Status Reports & Alerts",
    problem: "",
    roiHook:
      "The least exciting automation on the list. Also the one no business can live without once they have it.",
    industries: ["Agencies", "Construction", "Sales Teams", "E-commerce", "Professional Services"],
    icon: "chart",
  },
];

export const PRICING_TIERS = [
  {
    name: "AI Business Audit",
    price: "$500 \u2013 $1,500",
    basis: "one-time",
    description: "Diagnose before prescribing. I map your operations, find the leaks, and deliver a prioritized roadmap with ROI estimates.",
    features: [
      "Full operations analysis",
      "Cost-of-status-quo breakdown",
      "Prioritized automation roadmap",
      "Branded PDF report",
      "Follow-up strategy call",
    ],
    cta: "Start here",
    highlighted: false,
  },
  {
    name: "AI Implementation",
    price: "$2,000 \u2013 $5,000",
    basis: "fixed price",
    description: "I build the system. Custom workflows, integrations, and AI-powered tools, scoped to your highest-impact opportunity.",
    features: [
      "Everything in the Audit",
      "Agentic & n8n workflow builds",
      "Full-stack API integrations",
      "Complete system video walkthrough",
      "30-day bug support guarantee",
    ],
    cta: "Let\u2019s build",
    highlighted: true,
  },
  {
    name: "AI Transformation Retainer",
    price: "$1,000 \u2013 $3,000",
    basis: "per month",
    description: "Your ongoing AI partner. I continuously audit, implement, and improve your systems as your business evolves.",
    features: [
      "Everything in Implementation",
      "Ongoing workflow optimization",
      "New automation builds monthly",
      "Priority support",
      "Quarterly strategy reviews",
    ],
    cta: "Let\u2019s talk",
    highlighted: false,
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    title: "Business Transformation Client",
    description:
      "AI workflow automation for a professional coaching firm. Phase 1 delivered email triage, voice-to-task capture, and a daily briefing system. Phase 2 active: workspace overhaul, AI scheduling agent, and calendar-to-invoice automation.",
    tags: ["n8n", "ClickUp AI", "Claude API", "Workflow Automation"],
    metric: "5-7 hrs",
    metricLabel: "Saved Per Week",
    images: [
      { src: "/images/case-studies/workthentic/monthly-report.png", alt: "Automated monthly hours report email for coaching client" },
    ],
  },
  {
    title: "Construction & Civil Engineering Client",
    description:
      "A construction company based in Japan with 60+ years of excellent work but no way to showcase it. I helped them fully establish their online presence and implement AI in their business. Now their work speaks for itself online.",
    tags: ["Next.js", "Tailwind CSS", "Web Design"],
    metric: "Complete",
    metricLabel: "Digital Transformation",
    images: [
      { src: "/images/case-studies/kamata/kamata-website.png", alt: "Construction company redesigned website" },
    ],
  },
  {
    title: "KiwiOpic",
    description:
      "KiwiOpic builds OPIC test preparation curriculum for Korean professionals. Their team was producing content manually, spending hours on tasks AI could handle in minutes. I integrated AI across their workflow: curriculum drafting, content formatting, review cycles, and process automation. 80% of their manual work is now handled by AI.",
    tags: ["AI Integration", "Claude API", "Process Automation", "EdTech"],
    metric: "80%",
    metricLabel: "Manual Work Eliminated",
    images: [
      { src: "/images/case-studies/kiwiopic/platform.png", alt: "KiwiOpic OPIC test preparation platform" },
    ],
  },
  {
    title: "AIOS",
    description:
      "I don\u2019t just build AI systems for clients. I run my entire business on one. Autonomous agents manage my operations end to end: scheduling, research, reporting, client communication. If it works at this depth for me, imagine what it does for your business.",
    tags: ["n8n", "Claude API", "Telegram", "PostgreSQL", "Prisma"],
    metric: "100%",
    metricLabel: "Business Ops Automated",
    images: [
      { src: "/images/case-studies/aios/dashboard.png", alt: "AIOS Mission Control dashboard showing clients, revenue, and automation health" },
    ],
  },
];

export const TECH_STACK = [
  "n8n",
  "Claude API",
  "OpenAI",
  "Next.js",
  "TypeScript",
  "PostgreSQL",
  "Prisma",
  "Vercel",
];

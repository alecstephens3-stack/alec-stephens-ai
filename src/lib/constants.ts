import type {
  Service,
  CaseStudy,
  Testimonial,
  ProcessStep,
  Stat,
  NavLink,
} from "@/types";

export const SITE_NAME = "Alec Stephens AI Solutions";
export const SITE_URL = "https://alecstephensai.com";
export const CONTACT_EMAIL = "alecstephens3@gmail.com";
export const SITE_DESCRIPTION =
  "AI automation consultant helping businesses in the USA, Japan, and around the world save time with n8n workflows, Claude API integrations, and custom automation solutions.";

export const NAV_LINKS: NavLink[] = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const STATS: Stat[] = [
  { value: "20+", label: "Automations Delivered" },
  { value: "100+", label: "Hours Saved for Clients" },
  { value: "10+", label: "Platforms Integrated" },
];

export const SERVICES: Service[] = [
  {
    title: "AI Workflow Automation",
    description:
      "I build custom n8n and Make.com workflows that take repetitive tasks off your plate. Data processing, notifications, API orchestration, all running reliably in the background.",
    capabilities: [
      "n8n & Make.com workflows",
      "Data pipeline automation",
      "API orchestration",
      "Scheduled processing",
    ],
    icon: "workflow",
  },
  {
    title: "AI Strategy & Business Audits",
    description:
      "Not sure where to start with automation? I'll dig into your current processes, find the biggest opportunities, and give you a prioritized plan with clear ROI estimates.",
    capabilities: [
      "Process analysis",
      "Automation roadmapping",
      "ROI assessment",
      "Technology selection",
    ],
    icon: "strategy",
  },
  {
    title: "Custom Integrations",
    description:
      "Your tools should talk to each other. I connect APIs, databases, and third-party services so your data flows where it needs to go without manual work.",
    capabilities: [
      "REST & GraphQL APIs",
      "Database integrations",
      "Third-party connectors",
      "Data synchronization",
    ],
    icon: "integration",
  },
  {
    title: "AI-Powered App Development",
    description:
      "Full-stack applications that use Claude, OpenAI, and other AI APIs to do things that weren't possible a year ago. Built on Next.js and PostgreSQL, deployed to production.",
    capabilities: [
      "Next.js applications",
      "Claude & OpenAI integration",
      "PostgreSQL databases",
      "Production deployment",
    ],
    icon: "development",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We hop on a call and talk through your workflows, your pain points, and what you're trying to achieve. I figure out where automation will make the biggest difference.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "I map out the solution: the workflow logic, the integrations, how errors get handled, and how data moves through the system. You sign off before I start building.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "I build it, test it thoroughly, and get it running in your environment. Nothing ships until it handles the edge cases and works the way it should.",
  },
  {
    number: "04",
    title: "Support",
    description:
      "After launch, I stick around to monitor things and make adjustments. The goal is an automation that keeps working long after the project wraps up.",
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    title: "KanjiLens",
    description:
      "A full-stack AI learning app I built for studying Japanese. Snap a photo of any Japanese text, and it extracts the kanji, generates study packs with mnemonics and example sentences, and serves them up as SRS flashcards. Built while living in Japan to solve my own problem.",
    tags: ["Next.js", "Claude API", "Prisma", "PostgreSQL", "n8n"],
    metric: "90%",
    metricLabel: "Faster Study Pack Creation",
    images: [
      { src: "/images/case-studies/kanjilens/street-sign.png", alt: "Japanese street sign used as input for KanjiLens OCR scanning" },
      { src: "/images/case-studies/kanjilens/scan-results.png", alt: "KanjiLens scan results showing extracted kanji with new vs known indicators" },
      { src: "/images/case-studies/kanjilens/study-card.png", alt: "AI-generated study card with readings, compounds, mnemonics, and example sentences" },
      { src: "/images/case-studies/kanjilens/flashcard-review.png", alt: "SRS flashcard review interface with spaced repetition scoring" },
    ],
    demoVideo: "/videos/kanjilens-demo.mp4",
  },
  {
    title: "AI Job Intelligence System",
    description:
      "An n8n automation that scrapes job listings from multiple sources, scores them with AI based on your skills and preferences, stores everything in a Notion database, and sends you a daily priority report. Turns hours of manual job hunting into a 2-minute morning email.",
    tags: ["n8n", "PostgreSQL", "Claude API", "Notion", "Email"],
    metric: "15hrs",
    metricLabel: "Saved Weekly",
    images: [
      { src: "/images/case-studies/job-leads/n8n-workflow.png", alt: "Full n8n workflow for automated job lead scraping, scoring, and reporting" },
      { src: "/images/case-studies/job-leads/notion-database.png", alt: "Notion database with AI-scored job leads showing company, priority, and match score" },
      { src: "/images/case-studies/job-leads/daily-report.png", alt: "Daily job leads report email with priority scoring and AI-generated summaries" },
    ],
  },
  {
    title: "Document Processing Automation",
    description:
      "Built for a client in the medical industry who was spending hours manually sorting and extracting data from patient and compliance documents. The automation reads incoming documents, classifies them, pulls out the key information, and routes everything to the right department.",
    tags: ["n8n", "Claude API", "OCR", "Webhooks"],
    metric: "85%",
    metricLabel: "Faster Processing",
  },
  {
    title: "Customer Communication Automation",
    description:
      "An automation system built for a civil engineering firm that handles incoming client inquiries across multiple channels. AI generates draft responses, routes messages to the right project manager, and tracks response times. Cut average reply time by 3x.",
    tags: ["n8n", "Make.com", "Claude API", "APIs"],
    metric: "3x",
    metricLabel: "Faster Response Time",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Alec turned our manual reporting process into something that just runs on its own. What used to eat up 10 hours a week for our team now happens automatically.",
    name: "Coming Soon",
    title: "",
    company: "",
  },
  {
    quote:
      "The workflow Alec built paid for itself in the first month. He took the time to understand our business before writing a single line of code, and it showed in the result.",
    name: "Coming Soon",
    title: "",
    company: "",
  },
  {
    quote:
      "Working with Alec was different from other consultants we've tried. He didn't just build what we asked for. He found opportunities we hadn't even thought of.",
    name: "Coming Soon",
    title: "",
    company: "",
  },
];

export const TECH_STACK = [
  "n8n",
  "Make.com",
  "Claude API",
  "OpenAI",
  "Next.js",
  "TypeScript",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
  "Vercel",
];

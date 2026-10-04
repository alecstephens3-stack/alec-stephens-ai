// GENERATED from cases.yaml by export_ts.py
// (stephens-ai/artifacts/scrollcraft/builds/alec-portfolio). Do not edit by hand:
// change cases.yaml, then run `python3 export_ts.py`.

export type Figure = { value: string; unit: string; label: string };

export type BuildCase = {
  slug: string;
  tier: "deep" | "short";
  name: string;
  short: string;
  kicker: string;
  title: string;
  client: string;
  client_short: string;
  users: string;
  shipped: string;
  duration: string;
  /** The headline figure. `basis` says how it was worked out. */
  number: Figure & { basis?: string };
  second: Figure;
  wall: { n: string; phrase: string };
  oneliner: string;
  broken: string;
  built: string[];
  changed: { k: string; before: string; after: string }[];
  math_note: string;
  quote: { text: string; who: string } | null;
  compliance?: string;
  stack: string[];
  engineer: {
    architecture: string;
    runs_where: string;
    tests: string;
    cost: string;
    guardrails: string;
    tradeoff: string;
    repo: string | null;
    repo_note: string | null;
  };
  attribution: string;
  /** Image paths are public URLs (/alec/img/...). Each has a -800 twin. */
  media: {
    hero: string | null;
    alt: string | null;
    caption: string | null;
    gallery: { src: string; alt: string; caption: string }[];
  };
  links: { label: string; url: string }[];
};

export type Site = {
  base_url: string;
  path: string;
  title: string;
  description: string;
  email: string;
  calendly: string;
  github: string;
  linkedin: string;
  upwork: string;
  jusheen_linkedin: string;
  updated: string;
};

export type About = {
  name: string;
  role: string;
  paragraphs: string[];
  credentials: string[];
  cofounder: string;
  headshot: string;
};

export const SITE: Site = {
  "base_url": "https://stephensai.co",
  "path": "/alec",
  "title": "Alec Stephens · What I've built",
  "description": "Nine production builds with the numbers: a clinic knowledge base, a PTO and payroll system, invoice processing under a HIPAA agreement, an insurance claims tool for a dental practice, and more. Stack, cost, tests, and who built what.",
  "email": "alec@stephensai.co",
  "calendly": "https://calendly.com/alecpstephens/30min",
  "github": "https://github.com/alecstephens3-stack",
  "linkedin": "https://www.linkedin.com/in/alec-stephens-55b392213/",
  "upwork": "https://www.upwork.com/freelancers/~0144c4c3757a94de2e",
  "jusheen_linkedin": "https://www.linkedin.com/in/jusheenkim",
  "updated": "2026-10-04"
};

export const ABOUT: About = {
  "name": "Alec Stephens",
  "role": "Applied AI engineer. Co-founder, Stephens AI.",
  "paragraphs": [
    "I build systems that get my clients real results, and I absolutely love doing it.",
    "My experience runs across the board: healthcare clinics, coaching businesses, a nine-figure education company, construction firms in Japan, and more.",
    "I got here sideways, hired in Seoul to write English lessons and leaving with the company's curriculum running on an AI production line.",
    "What I do best is diagnose where a build will make a client money or save them time, then work alongside them to make it happen.",
    "Today I run Stephens AI with my co-founder Jusheen Kim, an ex-J.P. Morgan lead engineer. Our home turf is healthcare, where the work has to be HIPAA-compliant: a business associate agreement in force with the clinic, and the AI running on Claude via AWS Bedrock inside the clinic's own account, so patient data never leaves it.",
    "Outside Stephens AI, I also take contracts as an applied AI or forward-deployed engineer. And if you're ready to grow your business, it would be my pleasure to get you the results you need."
  ],
  "credentials": [
    "Upwork: 5+ years, 100% Job Success",
    "Stephens AI LLC, Kansas"
  ],
  "cofounder": "Co-founder: Jusheen Kim, ex-J.P. Morgan lead software engineer.",
  "headshot": "/alec/img/alec.jpg"
};

export const CASES: BuildCase[] = [
  {
    "slug": "knowledge-base",
    "tier": "deep",
    "name": "Clinic knowledge base",
    "short": "Knowledge base",
    "kicker": "Healthcare · optometry",
    "title": "Front desk knowledge base for an eye clinic: anyone at the desk finds the right answer in one search, without pulling a manager away",
    "client": "Wichita Family Vision, an independent optometry practice in Wichita, Kansas",
    "client_short": "Wichita Family Vision",
    "users": "The front desk and 2 office managers, daily since August 2026",
    "shipped": "Live 2026-08-07",
    "duration": "About 6 weeks from scope to live",
    "number": {
      "value": "~200",
      "unit": "hrs/yr",
      "label": "of interruptions off the office manager's desk",
      "basis": "About 4 questions a day that used to cost 10 minutes of digging or a manager's attention, now one search, over 250 working days."
    },
    "second": {
      "value": "35",
      "unit": "pages",
      "label": "of protocol, plus a 41-row price grid, maintained by the staff themselves"
    },
    "wall": {
      "n": "~200 hrs/yr",
      "phrase": "of manager interruptions gone each year, and the clinic's know-how kept in one place for good"
    },
    "oneliner": "The rules lived in 15 spreadsheet tabs and one manager's head. Now anyone at the desk, new or experienced, looks up the answer in the 20 seconds a caller gives you, and the managers keep it current themselves.",
    "broken": "Front desk training lived in 15 tabs of one spreadsheet, a separate scheduling protocol, a per-doctor rulebook, and the office manager's head. The dangerous exceptions were buried in parentheses. A new hire took about 6 months to learn the desk, and every unusual question interrupted a manager. Which doctor can see this patient? Do we collect for this or bill it?",
    "built": [
      "An installable web app on every front desk device: 35 protocol pages in 7 sections, a live 41-row price grid, and a report-an-issue loop that gets fixed the same day.",
      "4 decision tools that force the buried exceptions open: which doctors a patient can see, the right price with prompt-pay, whether to collect or bill a refraction, and how urgent a symptom is.",
      "In-app editing for 2 named managers, with revision history in plain English and one-click restore. No developer in the loop for a content change.",
      "Google sign-in restricted to the clinic's domain, row-level security on every table, sanitized rendering that fails closed, a monthly export as the backup."
    ],
    "changed": [
      {
        "k": "Where the rules live",
        "before": "15 spreadsheet tabs, a protocol doc, a rulebook, one person's memory",
        "after": "One searchable app, 35 pages, 4 tools"
      },
      {
        "k": "An unusual question",
        "before": "Interrupt a manager",
        "after": "Search, answer in under a minute"
      },
      {
        "k": "When someone leaves",
        "before": "Their know-how leaves with them",
        "after": "It stays in the app"
      },
      {
        "k": "Changing a rule",
        "before": "Email the developer, wait",
        "after": "Edit in the browser, history kept"
      },
      {
        "k": "Cost to run",
        "before": "Manager time",
        "after": "$0 a month in hosting"
      }
    ],
    "math_note": "About 4 interrupting questions a day at 10 minutes each, over 250 working days, gives roughly 200 hours a year. The office manager agreed the working was fair.",
    "quote": {
      "text": "This is highly valuable, both in the short term and long term. It's already saving a lot of time.",
      "who": "Jill Romines, Front Office Manager, Wichita Family Vision"
    },
    "stack": [
      "Supabase",
      "PostgreSQL with row-level security",
      "Google OAuth",
      "Vanilla JS PWA",
      "Vercel",
      "GitHub Actions",
      "DOMPurify",
      "Claude Code"
    ],
    "engineer": {
      "architecture": "Static PWA on Vercel reading page content, prices, and revisions from Supabase over the REST API. Editors are a Postgres table; RLS gives everyone read and 2 named emails write. Rendering sanitizes at read time, not only at save, so a REST write can never reach a reader unfiltered.",
      "runs_where": "Vercel (app), Supabase free tier (content, auth, revisions), Google Workspace sign-in locked to the clinic's domain. Installed as a PWA on the front desk iPad and PCs.",
      "tests": "21 regression tests plus a DOM-free sync-logic suite (31 assertions) covering restore, refresh, and the offline editor guard. Every test was written from a bug we actually hit.",
      "cost": "$0 a month to host. The clinic pays a small monthly retainer for the editing feature and a pass-through for the database tier.",
      "guardrails": "A pre-merge security review caught 2 cross-site-scripting holes: page HTML was sanitized on save but not on render, and the editor parsed pasted HTML into the live DOM before cleaning it. Both fixed by sanitizing at render, failing closed. Monthly JSON export is the backup because the free tier keeps none.",
      "tradeoff": "We built a plain PWA with search instead of the AI assistant layer the first scope had. Search on 35 well-structured pages answers the front desk's question faster than a chat box, costs nothing to run, and never invents a rule. The assistant is on the roadmap only if search ever fails a real staff question.",
      "repo": "https://github.com/alecstephens3-stack/supabase-team-knowledge-base",
      "repo_note": "The pattern, rebuilt without any clinic content: RLS, domain-gated auth, revision history, sanitizer, offline sync."
    },
    "attribution": "I built it: the content model from the clinic's front-desk documents, the 35 pages and 4 decision tools, in-app editing with revision history, and the tests. A second engineer ran the pre-merge security review and the deployment.",
    "media": {
      "hero": "/alec/img/knowledge-base/01-kb-home.webp",
      "alt": "The front desk knowledge base home screen: a search box, quick-pick chips, and the four decision tools",
      "caption": "The home screen the front desk sees. Clinic logo blurred; everything else is the live app.",
      "gallery": [
        {
          "src": "/alec/img/knowledge-base/02-kb-editing.webp",
          "alt": "In-app editing with revision history",
          "caption": "Managers edit in the browser; every change is kept and can be restored."
        },
        {
          "src": "/alec/img/knowledge-base/04-kb-eligibility-tool.webp",
          "alt": "The provider eligibility decision tool",
          "caption": "The eligibility tool: answer 4 questions, get the doctors this patient can see."
        },
        {
          "src": "/alec/img/knowledge-base/06-kb-on-tablet.webp",
          "alt": "The knowledge base installed on a tablet",
          "caption": "Installed on the front desk tablet as an app."
        }
      ]
    },
    "links": [
      {
        "label": "The pattern on GitHub",
        "url": "https://github.com/alecstephens3-stack/supabase-team-knowledge-base"
      }
    ],
    "compliance": "Built for a HIPAA-covered clinic with zero patient data in it by design: protocols and prices only, sign-in locked to the clinic's domain, a business associate agreement in force with the practice."
  },
  {
    "slug": "pto-payroll",
    "tier": "deep",
    "name": "PTO + payroll system",
    "short": "PTO + payroll",
    "kicker": "Healthcare · optometry",
    "title": "Time-off and payroll for an independent eye clinic: paper slips gone, and a system that runs itself year after year",
    "client": "Wichita Family Vision, an independent optometry practice in Wichita, Kansas",
    "client_short": "Wichita Family Vision",
    "users": "Every employee files from a phone; the office manager approves; the bookkeeper runs payroll from it. Live since April 2026",
    "shipped": "Live April 2026",
    "duration": "About 8 weeks, then 3 months of fixes found in production",
    "number": {
      "value": "60 to 100",
      "unit": "hrs/yr",
      "label": "of admin time returned",
      "basis": "10 to 12 paper slips a pay period at 15 to 20 minutes each, plus the manual calendar checks and payroll prep they caused."
    },
    "second": {
      "value": "327",
      "unit": "requests",
      "label": "filed, approved and posted to the calendar through it since April, with no paper slip in sight"
    },
    "wall": {
      "n": "60 to 100 hrs/yr",
      "phrase": "of paper-slip admin gone, and next year set up with one click"
    },
    "oneliner": "Green paper slips, hand-checked calendars, payroll rebuilt from paper. Now staff ask from their phones, the manager approves with one tap, and the payroll report builds itself every pay period, year after year.",
    "broken": "Time off ran on green paper slips handed to the office manager. She checked the calendar by hand, tracked balances by hand, lost slips, and could not approve from home. The bookkeeper rebuilt payroll every pay period from paper. About 60 to 100 admin hours a year, and no way to see who was off next week without asking.",
    "built": [
      "One Google Form on any phone. Staff pick dates and a type; partial days handled.",
      "An Apps Script engine that counts weekdays only, rounds to the clinic's rule, checks department conflicts, writes the attendance sheet and the shared calendar, and sends a one-tap approve or deny email.",
      "Anniversary-based accrual in year one, then calendar years. Balances are recomputed from the grid on every write instead of incremented, so a manual edit can never drift the totals.",
      "A payroll report every pay period, built into a dated folder for the bookkeeper. All 26 employee records migrated by a 700-line script that preserved the audit notes.",
      "A new year is one click. Next year's records for all 26 staff were built on 2 October 2026 from the admin menu, after a full rehearsal on copies, so requests for 2027 already work. The manager adds the paid hours with one more click."
    ],
    "changed": [
      {
        "k": "Filing a request",
        "before": "A green paper slip",
        "after": "A form on any phone"
      },
      {
        "k": "Approving",
        "before": "In the office, on paper",
        "after": "One tap in an email, from anywhere"
      },
      {
        "k": "The calendar",
        "before": "Checked by hand",
        "after": "Events post themselves"
      },
      {
        "k": "Balances",
        "before": "Hand-tracked, drifted",
        "after": "Recomputed on every write"
      },
      {
        "k": "Payroll prep",
        "before": "Rebuilt from paper each period",
        "after": "A report that builds itself"
      },
      {
        "k": "A new year",
        "before": "New paper, new balances by hand",
        "after": "One click from the admin menu"
      }
    ],
    "math_note": "The clinic estimated 10 to 12 slips a pay period at 15 to 20 minutes of handling each, before the calendar checks and payroll prep. 26 pay periods a year puts the range at 60 to 100 hours. The 327 requests are the system's own log on 1 October 2026.",
    "quote": null,
    "stack": [
      "Google Apps Script",
      "Google Forms",
      "Google Sheets",
      "Google Calendar",
      "Gmail",
      "clasp",
      "Node test runner"
    ],
    "engineer": {
      "architecture": "Form submit trigger into a bound Apps Script project of about 7,000 lines: validation, weekday and anniversary math, attendance-sheet writes, a calendar owned by a Workspace user the script runs as, approve and deny links served by a pinned web-app deployment, and a payroll builder on a time trigger.",
      "runs_where": "Entirely inside the clinic's Google Workspace. No server, no SaaS bill, $0 a month.",
      "tests": "183 regression assertions in the public repo, run with Node, no dependencies. Sections cover accrual routing, weekend-aware date math, partial days, recompute-on-write balance integrity, and the migration.",
      "cost": "$0 a month to run. Built at an hourly rate for the clinic.",
      "guardrails": "The web app URL is read from a config sheet, never from the script API, because the API returns a hidden test deployment. Every change that touches the approve button rolls the pinned deployment; skipping that once put new code on form-submit and old code on approvals. Error emails go to me, action emails go to the manager, so a test can never land in her inbox.",
      "tradeoff": "Apps Script over a hosted app. The clinic already paid for Google Workspace, the office manager lives in Sheets, and the data never leaves their account. A hosted app would have meant a login, a bill, and a vendor for a 26-person office. The cost of that choice is a deployment model with sharp edges, which the tests and the runbook now cover.",
      "repo": "https://github.com/alecstephens3-stack/apps-script-pto-payroll",
      "repo_note": "Anniversary-aware period routing, recompute-on-write balances, no dependencies, 183 tests."
    },
    "attribution": "I built it: the engine, the accrual and date math, the migration, the payroll report, the tests, and the guides. A second engineer added the employee-management dialogs and audited the sheets.",
    "media": {
      "hero": "/alec/img/pto-payroll/01-figure-flow.webp",
      "alt": "Diagram: one form feeds an Apps Script engine that writes the attendance sheet, shared calendar, approval email, balances, and payroll report",
      "caption": "One form, one engine, five outputs.",
      "gallery": [
        {
          "src": "/alec/img/pto-payroll/02-pto-approval-email.webp",
          "alt": "The approve or deny email",
          "caption": "The manager approves from her phone."
        },
        {
          "src": "/alec/img/pto-payroll/03-form-on-phone.webp",
          "alt": "The request form on a phone",
          "caption": "The whole intake is one form."
        },
        {
          "src": "/alec/img/pto-payroll/04-tests-183-green.webp",
          "alt": "Terminal output: 183 tests passing",
          "caption": "183 assertions, green."
        }
      ]
    },
    "links": [
      {
        "label": "Public repo, 183 tests",
        "url": "https://github.com/alecstephens3-stack/apps-script-pto-payroll"
      }
    ],
    "compliance": "Employee data only, no patient data, kept entirely inside the clinic's own Google Workspace. Built under the same business associate agreement as the clinic's other systems."
  },
  {
    "slug": "invoice-agent",
    "tier": "deep",
    "name": "Invoice processing system",
    "short": "Invoice processing",
    "kicker": "Healthcare · optometry · HIPAA",
    "title": "Invoice processing for a clinic's bookkeeper: she never processes an invoice by hand again",
    "client": "Wichita Family Vision, an independent optometry practice in Wichita, Kansas",
    "client_short": "Wichita Family Vision",
    "users": "The clinic's bookkeeper, since the install on 2026-10-01",
    "shipped": "Live 2026-10-01",
    "duration": "About 5 weeks from first scoping to install, including a rebuild onto the QuickBooks API",
    "number": {
      "value": "~200",
      "unit": "hrs/yr",
      "label": "of keying and filing off the bookkeeper's desk, at the 50 invoices a week the clinic plans for as it expands",
      "basis": "50 invoices a week, the volume the clinic plans for as it expands its services, at about 5 minutes each to key the bill into QuickBooks, rename the PDF and file it, over 50 working weeks: about 4 hours a week, about 200 hours a year."
    },
    "second": {
      "value": "5 of 5",
      "unit": "",
      "label": "totals right on the 5 real invoices she tested it with; QuickBooks' own bill reader got 2 of them wrong"
    },
    "wall": {
      "n": "~200 hrs/yr",
      "phrase": "of invoice keying and filing taken off a bookkeeper's desk, with her vendor rules followed every time"
    },
    "oneliner": "The bookkeeper used to key every vendor bill into QuickBooks and file every PDF by hand. Now she checks one table and clicks Go: each invoice is read, filed in the right vendor folder and entered in QuickBooks, following the clinic's vendor rules every time.",
    "broken": "Every vendor bill arrived as a PDF or a scan. The bookkeeper read each one, typed it into QuickBooks and filed it by hand into one of 184 vendor folders, keeping a set of rules in her head: frame vendors go in by their monthly statement, some lab vendors invoice by invoice, card-paid orders as expenses. The clinic plans for 50 invoices a week as it expands its services, and the owner wanted none of it to depend on one person. Some pages name patients, so ordinary AI tools without a HIPAA agreement were ruled out from the start.",
    "built": [
      "One review table. Every PDF in the Invoices folder is read and shown on a single page: the new file name, the vendor folder, the date, the amount, the QuickBooks vendor and the expense account, prefilled from how she has coded that vendor over the last 12 months. She fixes anything in place and clicks Go.",
      "Her rules, in code. Frame vendors go in by statement and their invoices are filed only; lab vendors go in invoice by invoice; card-paid vendors go in as card expenses on the right card, dated the order date. Anything that might already be in QuickBooks is shown to her instead of entered twice, and every run can be undone.",
      "Straight into QuickBooks through its API. Bills and card expenses are created from our own read, so QuickBooks never re-reads a page. A bill that cannot go in yet waits safely and goes in with one click once she fixes the reason.",
      "Built to be looked after from a distance. Fixes arrive as signed updates that install when she closes the app, and an error report reaches us the moment something goes wrong. When she tells us a vendor rule changed, the next update edits her Filing Rules file and keeps a copy of the old one."
    ],
    "changed": [
      {
        "k": "Entering a bill",
        "before": "Typed by hand from the PDF",
        "after": "Read, checked in one table, entered on Go"
      },
      {
        "k": "Filing the PDF",
        "before": "Renamed and dragged into 1 of 184 folders",
        "after": "Renamed and filed on the same click"
      },
      {
        "k": "Vendor rules",
        "before": "In one person's head",
        "after": "Written once, followed every run"
      },
      {
        "k": "Totals right on 5 of her real invoices",
        "before": "3 with QuickBooks' own reader",
        "after": "All 5"
      }
    ],
    "math_note": "The hours figure is a planning estimate, not a measurement: 50 invoices a week (the volume the clinic plans for as it expands) at about 5 minutes each to key, rename and file by hand, over 50 working weeks. She still checks the table, and the app puts an odd one to her rather than guessing (a possible duplicate, a zero-dollar rewards order). Running cost measured in the clinic's AWS account: about 1 cent an invoice.",
    "quote": null,
    "stack": [
      "Claude on AWS Bedrock",
      "Python",
      "QuickBooks Online Accounting API",
      "OAuth 2.0",
      "PyMuPDF",
      "PyInstaller",
      "Amazon S3",
      "CloudWatch",
      "Ed25519 signed updates",
      "Windows"
    ],
    "engineer": {
      "architecture": "A one-file Windows app that serves its own page on 127.0.0.1. The model only reads: each PDF goes to Claude Sonnet 4.6 on Bedrock. Everything after the read is deterministic code: vendor matching against her folders and her Filing Rules, which documents become bills, card expenses or nothing, the usual account from 12 months of her QuickBooks history, duplicate checks on vendor, number, date and amount, then bills or card expenses through the QuickBooks Online Accounting API with idempotent requests.",
      "runs_where": "On the bookkeeper's PC against the clinic's network drive. Reading runs in the clinic's own AWS account (us-east-1) under its BAA; QuickBooks is reached through OAuth, authorized by a company admin; signed updates come from the clinic's S3 bucket, and error reports go to its CloudWatch.",
      "tests": "40 offline cases against a fake QuickBooks; 25 browser checks on the real page; 22 update and reporting tests; every Windows build swaps itself between two real builds in CI. Before the install, a full code review found 39 verified issues; all were fixed and the fixes reviewed again.",
      "cost": "About 1 cent an invoice in the clinic's AWS account, measured from its Bedrock usage: a few dollars a month at 50 invoices a week.",
      "guardrails": "Nothing moves until she clicks Go. Undo moves the files back first, then removes only those bills, never a paid one. A possible duplicate is put to her, never entered or skipped silently. Updates are signed and only swap in when she closes the app, so a running session is never disturbed. Testing runs on invented invoices on our own account, never on the clinic's.",
      "tradeoff": "QuickBooks can read bills itself, and version 2 used that: on her real invoices it got 2 of 5 totals wrong, reading a discount as a charge and a unit price as the total. Version 3 keeps the reading in our model and writes the entry through the API with her rules in code. Claude Team and Cowork were the easier surface, but neither carries a BAA, so the reader moved to Bedrock in the clinic's own account.",
      "repo": null,
      "repo_note": null
    },
    "attribution": "I built it: the app, the QuickBooks integration, the self-update system and the tests. My co-founder worked the QuickBooks setup with me and joined the install.",
    "media": {
      "hero": "/alec/img/invoice-agent/01-review-table-v35.webp",
      "alt": "The review table with eight invented invoices: new file names, vendor folders, dates, amounts, QuickBooks vendor and account dropdowns, and a note per row, including a Select Optical order going in as a card expense",
      "caption": "The one table she checks. Invented invoices; nothing moves until Go.",
      "gallery": [
        {
          "src": "/alec/img/invoice-agent/02-result-v35.webp",
          "alt": "The result page: five entries in QuickBooks, including a card expense, two documents filed but not entered, one file left for her",
          "caption": "After Go: what went into QuickBooks, what was filed only, what still needs her."
        },
        {
          "src": "/alec/img/invoice-agent/03-needs-you-v35.webp",
          "alt": "A result page with one bill waiting because the vendor is not in QuickBooks yet",
          "caption": "A bill that can't go in yet waits, and goes in with one click once she adds the vendor."
        }
      ]
    },
    "links": [],
    "compliance": "HIPAA compliant by design. Pages are read by Claude on AWS Bedrock inside the clinic's own AWS account, under the clinic's business associate agreement with AWS. Invoices that name a patient go through that same protected path as every other page. QuickBooks only ever receives the vendor, date, invoice number and amount, never the page, and error reports leave out every file name and anything read off a page."
  },
  {
    "slug": "putback",
    "tier": "deep",
    "name": "Putback, insurance claims tool",
    "short": "Putback",
    "kicker": "Healthcare · dental · insurance",
    "title": "Putback, an insurance checker for a dental front desk: coverage checked two days before every visit, and every unpaid claim given a status and a next step",
    "client": "Tri-Valley Dental Care, an independent dental practice in Pleasanton, California",
    "client_short": "Tri-Valley Dental",
    "users": "Built for the front desk and the owner dentist",
    "shipped": "October 2026",
    "duration": "About a week from the first version to the one built around the practice's schedule and aging report",
    "number": {
      "value": "2 days",
      "unit": "ahead",
      "label": "every patient on the schedule sent to the insurer before the visit, with the ones who need something, or need a call, listed first",
      "basis": "Before the visits runs over the practice's schedule export about two days ahead of the appointments."
    },
    "second": {
      "value": "16",
      "unit": "situations",
      "label": "from what the practice's front desk told us, each answered with the exact words to ask the patient"
    },
    "wall": {
      "n": "2 days ahead",
      "phrase": "every patient's insurance checked before the visit, and every unpaid claim given a status and a next step"
    },
    "oneliner": "Insurance problems used to surface at the visit or months later on the aging report. Putback puts them in front of the desk two days ahead, and every claim that hasn't paid comes with a status and the next step, in plain words.",
    "broken": "A one-dentist PPO practice checked insurance by hand, insurer portal by insurer portal, and worked unpaid claims from an aging report that says how old a claim is but never why it hasn't paid. Every insurer wants different details, some won't find a patient by name and birthday at all, and a claim left too long can miss the insurer's timely filing limit.",
    "built": [
      "Before the visits. The schedule goes in about two days ahead, and every patient comes back Ready or Attention, with the problem first: coverage ended, the year's maximum used up, the plan assigned to another office. Each one says what to do.",
      "Check coverage. One card with what the claim needs: active dates, what's left of the annual maximum, the deductible, member ID and group number, and coverage by category, with frequency limits where the insurer sends them.",
      "Claims this week. Every claim on the aging report gets one status: denied, needs info, no record, call, paid or pending. Where the insurer sends a reason, it's in plain words, and every status comes with the next step, like the attachment the insurer is waiting on or a payment that still needs posting.",
      "What each insurer needs. A grid built from the same rules the checks run, so the desk knows which insurers can find a patient by name and birthday and what to ask for the rest."
    ],
    "changed": [
      {
        "k": "Checking coverage",
        "before": "Portal by portal, by hand",
        "after": "The whole schedule, two days ahead"
      },
      {
        "k": "A patient with a problem",
        "before": "Found at the visit",
        "after": "Listed first, with what to ask"
      },
      {
        "k": "An unpaid claim",
        "before": "A line on the aging report",
        "after": "A status and a next step"
      },
      {
        "k": "What each insurer needs",
        "before": "Learned call by call",
        "after": "One grid, from the same rules"
      }
    ],
    "math_note": "Checks go through a healthcare clearinghouse at about 30 cents each at its published rate. Every screen on this page uses sample patients.",
    "quote": null,
    "stack": [
      "Python",
      "FastAPI",
      "Stedi clearinghouse API",
      "X12 270/271 eligibility",
      "X12 276/277 claim status",
      "pydantic",
      "httpx",
      "pytest"
    ],
    "engineer": {
      "architecture": "A Python service with a one-page web front end. Coverage checks are X12 270/271 eligibility requests through Stedi; claim status is 276/277. Deterministic code reads every insurer's answer: plan-year against coverage dates, ranked maximum and deductible rows, split categories (a crown at 60% beside a repair at 90%), DeltaCare facility matching. The schedule and the aging report come in as the exports the desk already makes, so nothing has to connect into the practice software.",
      "runs_where": "On the practice's own computer, answering only on that machine unless a password is set, with the clearinghouse as the one outside connection.",
      "tests": "210 automated tests across 14 files, plus 12 recorded insurer answers from the clearinghouse's test mode. Three QA passes and a review against 15 test requests to sample insurers.",
      "cost": "About 30 cents a check at the clearinghouse's published rate for the first 250 a month.",
      "guardrails": "It never guesses. A check that is missing a detail says what to ask the patient instead of sending a guess, and an incomplete search never tells the desk to resubmit. An insurer that does not answer claim status electronically, like MetLife, is marked Call rather than given an answer it never sent.",
      "tradeoff": "No direct connection into Dentrix yet. The schedule export and aging report the desk already makes are enough to run on, and an approved integration costs thousands up front. A direct connection comes once enough practices on the same software are using it.",
      "repo": null,
      "repo_note": null
    },
    "attribution": "My co-founder built the first version. I rebuilt how it reads each insurer's answers, added the Before the visits check, and ran the QA passes.",
    "media": {
      "hero": "/alec/img/putback/01-before-the-visits.webp",
      "alt": "Before the visits screen with sample patients: five marked Attention at the top, each with a plain reason and a Do line, above patients marked Ready",
      "caption": "The schedule, checked two days ahead, with the patients who need something first. Sample patients.",
      "gallery": [
        {
          "src": "/alec/img/putback/02-coverage-card.webp",
          "alt": "Coverage card for a sample Delta Dental patient: active, $1,340 left this year, subscriber ID, group number and what the plan pays by category",
          "caption": "One card with everything the claim needs."
        },
        {
          "src": "/alec/img/putback/03-claims-this-week.webp",
          "alt": "Claims this week: counts for denied, needs info, no record, call, paid and pending, above denied claims each with a reason and a next step",
          "caption": "Every claim on the aging report gets a status and a next step."
        },
        {
          "src": "/alec/img/putback/04-what-each-insurer-needs.webp",
          "alt": "A grid of six insurers showing which can be checked by name and birthday and what to ask for the others",
          "caption": "What each insurer needs, so the desk asks once."
        }
      ]
    },
    "links": [],
    "compliance": "No real patient data goes through it until business associate agreements are signed, and then only under those agreements. It never asks for a Social Security number, never sends a guessed detail to an insurer, and its logs carry only request IDs and insurer names."
  },
  {
    "slug": "ai-lab",
    "tier": "deep",
    "name": "AI Lab content + outbound systems",
    "short": "AI Lab",
    "kicker": "AI education · content and outbound systems",
    "title": "An AI education channel run as a system, then an outbound machine built in 3 weeks and instrumented so the data could say no",
    "client": "AI Lab, the AI education brand inside iPhone Photography School (a 1M+ audience company, Latvia). Applied AI Engineer (in-house), contract, March to September 2026",
    "client_short": "AI Lab, iPhone Photography School",
    "users": "2 educators, an operations lead, and a leadership team reading the weekly numbers; members watching the tutorials",
    "shipped": "March to September 2026",
    "duration": "6 months, in two phases",
    "number": {
      "value": "~10",
      "unit": "hrs/wk",
      "label": "returned to a two-person content team by an idea-to-published pipeline, a person approving every send",
      "basis": "The team's own estimate of the hours the idea engine, publishing pipeline, newsletter builder and KPI report took off the week."
    },
    "second": {
      "value": "320",
      "unit": "mailboxes",
      "label": "on 10 domains, grown from 104 on 2 in 3 weeks, with a rule check on every email before it could send"
    },
    "wall": {
      "n": "~10 hrs/wk",
      "phrase": "returned to the content team, and an outbound machine built in 3 weeks that reported its own numbers honestly"
    },
    "oneliner": "Two systems for one brand: a pipeline that let two educators publish on schedule with a person approving every send, then a cold email machine that told leadership, with numbers, that the channel was wrong for this buyer.",
    "broken": "Phase one: a channel teaching AI to non-technical adults needed a steady stream of short tutorials, 3 newsletters a week, and weekly numbers, with 2 educators and no production team. Phase two: the company restructured around a B2B arm with a December deadline, inheriting a sending stack from a departing contractor, no lead pipeline, no offer, and no defined buyer.",
    "built": [
      "Content: an idea engine with semantic dedup against every video ever made, mandatory research, and a scoring rubric with hard gates; a taste model mined from months of accept and reject decisions that cut the context loaded per run by 79%.",
      "Content: a one-command publishing pipeline with a loudness gate at a fixed -14 LUFS, Wistia upload into the right series, tracker write, thumbnail set; a Monday, Wednesday, Friday newsletter builder that stages a verified test send for a human to approve; a weekly KPI report leadership reads.",
      "Outbound: sourcing from Google Maps and public registries, Claude research writing one factual opener per business, an automated rule gate on every email, and 2-step plain-text sequences from 320 mailboxes on 10 domains under capacity rules, at about $1 per 30 leads.",
      "Offer and ICP: 11 niches scored on 2026 data and cut to one buyer with a kill date; 2 complete three-tier offer chains; a savings calculator; the delivery playbook for a workshop product; a clean two-day wind-down with a full export and a restart guide."
    ],
    "changed": [
      {
        "k": "Deciding what to film",
        "before": "A gut call and a spreadsheet",
        "after": "Scored ideas that pass hard gates"
      },
      {
        "k": "Publishing a video",
        "before": "Manual upload, manual tracker",
        "after": "One command, loudness-gated"
      },
      {
        "k": "Newsletters",
        "before": "Written by hand 3 times a week",
        "after": "Built, staged, approved by a person"
      },
      {
        "k": "Sending capacity",
        "before": "2 domains, 104 mailboxes",
        "after": "10 domains, 320 mailboxes, warmed"
      },
      {
        "k": "What the data said",
        "before": "Unknown",
        "after": "2.2% human replies; the question beat the pitch every A/B; not the channel for this buyer"
      }
    ],
    "math_note": "Outbound numbers are from the campaign export for 4 August to 7 September 2026: 4,349 emails, 2,661 businesses, 91 replies of which 51 were human (2.2%), 3 marked interested, 0 confirmed calls. That last number is the point: the system was built to report it honestly, and the restart guide says why. The ~10 hours a week on the content side is the team's own estimate.",
    "quote": null,
    "stack": [
      "Claude Code",
      "Codex",
      "MCP",
      "Python",
      "Wistia API",
      "Circle",
      "Customer.io",
      "Smartlead",
      "Clay",
      "Apify",
      "Google Workspace",
      "Slack",
      "Kie image API",
      "Whisper"
    ],
    "engineer": {
      "architecture": "A shared context layer (voice, rules, trackers, decisions) synced to both Claude Code and Codex, so any agent picks up where the last one stopped. Skills for each job: video ideas, post-video, newsletter build and publish, KPI report, lead enrich, lead check, email capacity. MCP and API connections into Wistia, Circle, the email platform, Google Workspace, and Slack.",
      "runs_where": "On the educators' machines, with a person pressing start. Sending ran on Smartlead over Microsoft mailboxes; sourcing on Apify and free registries; the KPI report published to a stable link.",
      "tests": "A rule gate on every cold email (no years, no street names, no clinical language, no 'AI', sign-off matches the inbox), run as a script before any batch. A lint on the KPI report before publish, with a corrections trail when a number was wrong. Every capacity number came from the script, never from memory.",
      "cost": "About $1 per 30 researched leads. The content pipeline ran on existing subscriptions.",
      "guardrails": "A human approves every send: newsletters stage a verified test, campaigns stay drafts until a person activates them. Capacity rules (2 emails per inbox, 100 per domain per day, 14-day warm-up) enforced in code. The whole outbound system was wound down in 2 days with a full export and a restart guide.",
      "tradeoff": "The opinion question beat the direct pitch in every A/B pair, so we stopped pitching. And when the numbers said cold email was not the channel for this buyer, we reported that instead of optimizing the copy again. The system's job was to make that finding checkable.",
      "repo": null,
      "repo_note": "The live proof pages (offer chains, ICP decision, KPI report, savings calculator) are still up on Vercel; links on request."
    },
    "attribution": "I built all of it as the in-house Applied AI Engineer, alongside a second educator on the content side. The sending stack was inherited from a departing contractor and rebuilt.",
    "media": {
      "hero": "/alec/img/ai-lab/01-figure-architecture.webp",
      "alt": "Diagram: a shared context layer feeding the idea engine, publishing pipeline, newsletter builder, and KPI report, connected to the video host, community, email platform, Google Workspace, and Slack",
      "caption": "One shared context layer, agents in two tools, connections into the tools the team already used.",
      "gallery": []
    },
    "links": []
  },
  {
    "slug": "coaching-aios",
    "tier": "short",
    "name": "Coaching practice AI system",
    "short": "Coaching AI system",
    "kicker": "Professional coaching · solo founder",
    "title": "An AI operating system for a one-person coaching practice: 4 custom agents she runs and changes herself, in plain English",
    "client": "A business coach and HR consultant in California (kept anonymous at her request until her testimonial lands)",
    "client_short": "A business coach",
    "users": "The founder, daily, April to July 2026; she owns and edits it herself",
    "shipped": "Live May 2026",
    "duration": "About 10 weeks, in phases",
    "number": {
      "value": "4",
      "unit": "custom AI agents",
      "label": "built for her practice, inbox triage, scheduling replies, voice-note task capture and meeting notes, all reading one brain document she edits in plain English",
      "basis": "Phase A shipped and live: the Brain Doc plus 4 ClickUp Super Agents (Email Manager, Scheduling, Brain Dump, Maintainer), with meeting notes on a scheduled routine she owns."
    },
    "second": {
      "value": "115 of 115",
      "unit": "",
      "label": "stale tasks archived in one sweep, fully reversible, because every agent stamps its work"
    },
    "wall": {
      "n": "4 custom AI agents",
      "phrase": "running a one-person coaching practice from one plain-English document she edits herself"
    },
    "oneliner": "Four custom agents built for how she actually works, all reading one document she edits in plain English. She owns every piece, so nothing depends on us to keep it running.",
    "broken": "A veteran HR leader running her own practice was doing her own inbox triage, scheduling, task capture, meeting notes, and invoice prep by hand. 10 to 12 hours to format one 3-hour workshop. A client had questioned a one-hour line item, and she had no receipts.",
    "built": [
      "The brain document: one doc holding her voice, brand rules, client roster, and policies, read by every agent as live knowledge. She changes it by messaging a maintainer agent in plain English.",
      "4 agents inside her project tool: inbox triage that defaults to skip and cites the source message, scheduling that drafts the reply inside the task, voice-note capture that splits and routes, and meeting notes on a scheduled routine she owns.",
      "Calendar to invoice: on the first of the month it reads both calendars, parses client and service codes from the events, and writes hours to a color-coded sheet. Receipts, automatically.",
      "Every agent stamps its work, so output is always attributable and sweepable. That made a 115-task cleanup safe, reversible, and rehearsed in a sandbox first."
    ],
    "changed": [
      {
        "k": "Inbox",
        "before": "Read everything herself",
        "after": "13 to 15 a day triaged, sources cited"
      },
      {
        "k": "Scheduling replies",
        "before": "Written by hand",
        "after": "Drafted inside the task"
      },
      {
        "k": "Invoicing proof",
        "before": "None",
        "after": "Calendar to sheet, monthly"
      },
      {
        "k": "Changing a rule",
        "before": "Re-prompt every tool",
        "after": "Edit one document"
      }
    ],
    "math_note": "The email count is her daily inbox volume during the build; the 115 tasks were the stale backlog archived on 2026-07-20 with an undo manifest kept.",
    "quote": null,
    "stack": [
      "Claude",
      "ClickUp Super Agents",
      "ClickUp Brain",
      "n8n (then)",
      "Google Calendar",
      "Google Sheets"
    ],
    "engineer": {
      "architecture": "No-code agents configured in plain English inside ClickUp, all pointed at one Brain Doc as shared knowledge. A maintainer agent is the only writer to that doc. One integration workflow for calendar to sheet, because that step crosses tools.",
      "runs_where": "Inside her own ClickUp and Google accounts. She owns every piece; the exit shipped a portable 7-file operating system and a 15-page printed system tour.",
      "tests": "A regression test per agent after a scope-creep incident, where the maintainer rewrote unrelated sections; instructions hardened with a self-check step. The 115-task sweep was rehearsed in a sandbox before it ran.",
      "cost": "About $20 a month in tooling.",
      "guardrails": "Every agent defaults to skip, forces the assignee and a source stamp on every task it creates, and must cite the inbox message it acted on. No agent sends email.",
      "tradeoff": "Native ClickUp agents instead of a custom stack. Less power, but she can read and change every instruction herself, and there is nothing of ours to maintain. A one-person practice needs a system she owns, not a vendor.",
      "repo": null,
      "repo_note": null
    },
    "attribution": "I built all of it.",
    "media": {
      "hero": "/alec/img/coaching-aios/01-figure-brain-and-agents.webp",
      "alt": "Diagram: one brain document read by four agents, with a maintainer agent as its only editor",
      "caption": "One document, four agents, one maintainer.",
      "gallery": []
    },
    "links": []
  },
  {
    "slug": "construction-site",
    "tier": "short",
    "name": "Construction company website",
    "short": "Construction website",
    "kicker": "Construction · Japan",
    "title": "A Japanese construction company's website, redesigned so every word is readable and their real work leads",
    "client": "Kamata Koumuten, a construction company in Miyagi, Japan",
    "client_short": "Kamata Koumuten",
    "users": "The company's storefront; its owner and her customers",
    "shipped": "Rebuilt May 2026, redesigned October 2026",
    "duration": "About 3 weeks for the rebuild, then a full redesign",
    "number": {
      "value": "1",
      "unit": "industry board",
      "label": "now referring the work: a regional construction association board member is recommending the site to the whole board",
      "basis": "One board member's active recommendation, off the rebuilt site. No board contract signed."
    },
    "second": {
      "value": "16px",
      "unit": "",
      "label": "the smallest text anywhere on the redesign, checked automatically at 4 screen widths; on the old site up to 88% of the text was under 14px"
    },
    "wall": {
      "n": "1 industry board",
      "phrase": "now referring us, off a site redesigned so every word is readable"
    },
    "oneliner": "Tiny text, a broken phone layout and a contact form that never delivered. Now a calm, readable site that leads with their real jobs and brings in referral work.",
    "broken": "On the old site, 66% to 88% of the text was under 14px depending on the page, and up to 59% failed basic contrast. The phone homepage ran about 28 screens long, the work was shown as icon cards for a business whose work is visual, and the contact form had never delivered a single inquiry.",
    "built": [
      "A redesign in their own language: a slowly moving hero over a finished driveway and gate, the company's history since 1965, what they build, and a numbers band, set in the serif and sans pair the owner already knew.",
      "Their real jobs up front: six projects, each with a before and after switch under the photo, and the story of the Tohoku University student rocket team whose engine firing they hosted on their land.",
      "Readability enforced in code: nothing under 16px and running text at 17px or more, checked at 4 screen widths before any version is shown.",
      "Underneath, from the first rebuild: a one-command deploy that backs up first and health-checks every page, and Google Search Console set up."
    ],
    "changed": [
      {
        "k": "The smallest text",
        "before": "Up to 88% under 14px",
        "after": "Nothing under 16px"
      },
      {
        "k": "Reading it on a phone",
        "before": "About 28 screens of homepage",
        "after": "Built for the phone, large type"
      },
      {
        "k": "Showing the work",
        "before": "Icon cards",
        "after": "Real jobs with before and after"
      },
      {
        "k": "Google",
        "before": "No Search Console",
        "after": "Search Console set up"
      },
      {
        "k": "Referrals",
        "before": "None from the site",
        "after": "An industry board member recommending it"
      }
    ],
    "math_note": "The old site's figures come from our audit of its pages. The referral is one board member's active recommendation; no board contract has been signed.",
    "quote": null,
    "stack": [
      "HTML",
      "CSS",
      "JavaScript",
      "Noto Serif JP",
      "Noto Sans JP",
      "Vercel previews",
      "lftp deploys",
      "Google Search Console"
    ],
    "engineer": {
      "architecture": "A static homepage with a looping hero video, a survey-pole rail that marks the current section on wide screens, and before and after switches on the project photos. It deploys to the client's existing shared PHP host by mirror, with a backup taken first.",
      "runs_where": "The client's own hosting, with previews on Vercel. Nothing of ours in the loop.",
      "tests": "A type check fails if any visible text drops under 16px at 1440, 1024, 390 or 360 wide. Every deploy verifies each page returns 200 and the search-console verification file is intact.",
      "cost": "The client's existing hosting. No new subscriptions.",
      "guardrails": "Never delete the search-console verification file. Backup before every mirror. The deploy script changes into the directory first, because the mirror tool silently no-ops on paths with spaces.",
      "tradeoff": "Kept their host and a static site instead of moving them to a builder. The owner's team is not technical, so the cheapest thing to maintain is a folder of HTML they own, plus a small CMS later for the one job they actually do themselves: posting a finished project.",
      "repo": null,
      "repo_note": null
    },
    "attribution": "I built all of it. The hero scene is generated imagery; every project photo is the company's own.",
    "media": {
      "hero": "/alec/img/construction-site/01-v1-home-desktop.webp",
      "alt": "Kamata Koumuten homepage: the headline 地域と共に歩む。 over a sunny work site beside a finished house and gate",
      "caption": "The redesigned homepage, with a slowly moving hero.",
      "gallery": [
        {
          "src": "/alec/img/construction-site/02-v1-works-desktop.webp",
          "alt": "Project gallery with real photos of a carport job and a retaining wall job, each with a before and after switch",
          "caption": "Their real jobs, each with a before and after switch."
        },
        {
          "src": "/alec/img/construction-site/03-v1-home-phone.webp",
          "alt": "Two phone screens: the hero with contact buttons, and a project photo with its before and after switch",
          "caption": "Built for the phone, with large, readable Japanese."
        },
        {
          "src": "/alec/img/construction-site/04-v1-community-desktop.webp",
          "alt": "Community section with a real photo of a rocket engine test firing beside the story",
          "caption": "The student rocket team they hosted."
        }
      ]
    },
    "links": [
      {
        "label": "kamata-koumuten.co.jp",
        "url": "https://kamata-koumuten.co.jp"
      },
      {
        "label": "The Japanese offer page, stephensai.co/jp",
        "url": "https://stephensai.co/jp"
      }
    ]
  },
  {
    "slug": "curriculum-system",
    "tier": "short",
    "name": "Curriculum generation system",
    "short": "Curriculum system",
    "kicker": "Education technology · Korea · 2020 to 2024",
    "title": "A test-prep company that keeps producing curriculum without adding staff: about 80% of the manual work handled by AI",
    "client": "KiwiOPIC, an English test-prep company in Seoul",
    "client_short": "KiwiOPIC",
    "users": "The curriculum team and thousands of learners preparing for the OPIc speaking test, 2020 to 2024",
    "shipped": "2020 to 2024",
    "duration": "4 years, built while working there",
    "number": {
      "value": "~80%",
      "unit": "",
      "label": "of the manual curriculum work now handled by AI",
      "basis": "Per Alec, confirmed 2026-07-25; the company's own estimate."
    },
    "second": {
      "value": "95%+",
      "unit": "",
      "label": "transcription and feedback accuracy on learners' spoken answers"
    },
    "wall": {
      "n": "~80%",
      "phrase": "of a curriculum team's manual work now handled by AI"
    },
    "oneliner": "Hired to write English lessons. Left having turned the company's production line into an AI-assisted pipeline.",
    "broken": "Every practice question, model answer, and lesson for a computer-delivered oral proficiency interview was written by hand by a small team. I was hired to write that curriculum.",
    "built": [
      "Question generation: a pipeline that produces OPIc-style interview questions across the exam's topics and difficulty levels, in the register the test actually uses.",
      "Curriculum generation: lesson and test material drafted, formatted, and run through a review cycle, with the model taking the first pass and a human the last.",
      "A speaking feedback loop: speech-to-text wired to a language model so learners' spoken answers were transcribed and scored, at 95%+ accuracy.",
      "Process automation between drafting and publishing, and the team trained on the new workflows as they were built."
    ],
    "changed": [
      {
        "k": "Writing questions",
        "before": "By hand, one at a time",
        "after": "Generated per topic and level, reviewed"
      },
      {
        "k": "Production time",
        "before": "Baseline",
        "after": "About 40% less"
      },
      {
        "k": "Feedback",
        "before": "A teacher, days later",
        "after": "Transcribed and scored, 95%+"
      },
      {
        "k": "Headcount",
        "before": "Would have grown",
        "after": "200+ curriculum hours shipped without hiring"
      }
    ],
    "math_note": "These figures are the company's own estimates as Alec reported them; there is no primary artifact in our records. Treat the percentages as approximate.",
    "quote": null,
    "stack": [
      "LLM APIs",
      "speech-to-text APIs",
      "prompt pipelines",
      "automated review cycles"
    ],
    "engineer": {
      "architecture": "Prompt pipelines per content type, a human-last review cycle, and a transcription-plus-scoring loop for spoken answers.",
      "runs_where": "Inside the company's own tooling at the time.",
      "tests": "Model-first, human-last review on every published item; accuracy tracked on the feedback loop.",
      "cost": "Not recorded.",
      "guardrails": "A human signed off on every published lesson.",
      "tradeoff": "Generate the first draft, never the final. The register of the test is narrow enough that a model drafts it well and a teacher's last pass keeps it honest.",
      "repo": null,
      "repo_note": null
    },
    "attribution": "I built it, as the English curriculum specialist who became the AI integration lead.",
    "media": {
      "hero": null,
      "alt": null,
      "caption": null,
      "gallery": []
    },
    "links": []
  },
  {
    "slug": "aios",
    "tier": "short",
    "name": "The Bridge, our AI operating system",
    "short": "The Bridge",
    "kicker": "Stephens AI · our own tooling",
    "title": "The Bridge: the AI operating system our company runs on every day, where every new tool is tested before a client sees it",
    "client": "Stephens AI, our own consultancy",
    "client_short": "Stephens AI",
    "users": "Me, every day: the operating system since March 2026, the Bridge on top of it since September",
    "shipped": "v2 live 2026-03-01",
    "duration": "Ongoing",
    "number": {
      "value": "10",
      "unit": "agents",
      "label": "each on a least-privilege tool list, plus 45 reusable skills, kept lean by a monthly audit that retires what stops earning its place"
    },
    "second": {
      "value": "07:30",
      "unit": "",
      "label": "every morning: new meeting recordings become pages, priorities, decisions, and a text with the action items"
    },
    "wall": {
      "n": "10 agents · 45 skills",
      "phrase": "running our own company every day, where every tool is tested before a client gets it"
    },
    "oneliner": "We run our own company on it every day: calendar, inbox, messages, meetings and priorities on one screen, with the whole company's knowledge behind it. Anything we install for a client runs here first.",
    "broken": "A consultancy of two generates the same admin any client does: meeting notes, priorities, research, proposals, follow-ups, and a vault of context that goes stale the moment nobody reads it.",
    "built": [
      "The Bridge, a dashboard over the whole company: a 3D map of every note, both calendars merged and editable, both inboxes, iMessage and Slack, health data, and Ask Charlie, a chat over the whole knowledge base that can read but never edit or send. Voice dictation in every box.",
      "10 specialist agents, each on a least-privilege tool list (reviewers that read like a dentist, an optometrist or a physical therapist; research; meeting notes), and 45 reusable skills for proposals, research, QA, deploys and reporting.",
      "Scheduled jobs: a daily 07:30 meeting sweep that writes the meeting page, updates the week's priorities, logs decisions, and texts the action items; a weekly vault health check. Every run leaves an inspectable log.",
      "Doctrine, written down: verify the output, augment rather than replace, understand the why, loop humans in, stay transparent. What stops earning its place gets retired."
    ],
    "changed": [
      {
        "k": "After a client call",
        "before": "Notes typed up later, or not",
        "after": "Page, priorities, decisions, text by 07:30"
      },
      {
        "k": "Finding a fact",
        "before": "Grep and memory",
        "after": "Retrieval search over the vault"
      },
      {
        "k": "A repeated job",
        "before": "Re-explained each time",
        "after": "A skill with the gotchas encoded"
      },
      {
        "k": "Sending anything",
        "before": "Whatever the model decided",
        "after": "A human approval step, always"
      }
    ],
    "math_note": "Counts are from the system's own folders on 4 October 2026. They change as skills earn their place or get retired.",
    "quote": null,
    "stack": [
      "Claude Code",
      "Claude Agent SDK",
      "MCP",
      "Python",
      "Three.js",
      "Playwright",
      "Groq Whisper",
      "Fathom",
      "Google Workspace",
      "launchd"
    ],
    "engineer": {
      "architecture": "A markdown vault with frontmatter as the database, a generator that rebuilds the index, sub-agents defined as files with tool allow-lists, skills as files with the gotchas at the top, a local dashboard server, and scheduled jobs on the Mac that deliver to iMessage.",
      "runs_where": "On my Mac, with connectors into Google Workspace, Slack, Fathom, and the clients' tools.",
      "tests": "A weekly lint over the vault (contradictions, stale facts, orphans), a layout lint on every branded page, and a two-reviewer gate (adversarial fact-check plus a domain reviewer) before anything client-facing ships.",
      "cost": "One subscription plus about $10 a month of API credits.",
      "guardrails": "Every agent runs on a least-privilege allow-list. Nothing is sent, deleted, or deployed without a fresh yes. Every scheduled job leaves a trace.",
      "tradeoff": "Files over a database. A vault of markdown is slower to query than Postgres, but every agent, every human, and every future rebuild can read it, and the whole thing is in git.",
      "repo": null,
      "repo_note": null
    },
    "attribution": "I built all of it.",
    "media": {
      "hero": "/alec/img/aios/01-bridge-brain-view.webp",
      "alt": "The Bridge dashboard: a 3D graph of the vault beside today's calendar and inbox",
      "caption": "The Bridge, the dashboard we run the company from. Two panels blurred.",
      "gallery": []
    },
    "links": []
  }
];

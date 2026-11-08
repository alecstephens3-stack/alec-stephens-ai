// GENERATED from cases.yaml (v2) by export_ts.py
// (stephens-ai/artifacts/scrollcraft/builds/alec-portfolio). Do not edit by hand:
// change cases.yaml, run `python3 build.py`, then `python3 export_ts.py`.

/** A public image URL with its natural size. Screens have a -800.webp twin; posters don't. */
export type Img = { src: string; w: number; h: number };
export type Result = { value: string; unit: string; label: string; basis?: string };
/** One step of the flow. A shot's crop is [x, y, width] in the image's own pixels; height follows the window's shape. */
export type FlowStep = {
  step: string;
  how: string;
  shows: { kind: "anim" } | ({ kind: "shot"; crop: [number, number, number] | null } & Img);
};
export type Anim = { scene: string; w: number; h: number; title: string; caption: string; poster: { desktop: Img; phone: Img } };

export type BuildCase = {
  slug: string;
  tier: "full" | "short";
  name: string;
  kicker: string;
  line: string;
  client_short: string;
  status: string;
  results: Result[];
  flow: FlowStep[];
  built: { lead: string; text: string }[];
  before_after: { k: string; before: string; after: string }[];
  quote: { text: string; who: string } | null;
  stack: string[];
  eng: { architecture: string; choice: string; tests: string; cost?: string; runs_where?: string };
  repos: { label: string; url: string }[];
  role: string;
  media: {
    animation: Anim | null;
    /** `phone`: a stacked version of a dense figure, shown under 640px instead of the hero. */
    hero: Img & { alt: string; caption: string; phone?: Img };
    gallery: (Img & { alt: string; caption: string })[];
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
  "description": "10 builds I've shipped: insurance claims software, computer-use agents, invoice processing under a HIPAA agreement, a clinic knowledge base, a PTO and payroll system, and more.",
  "email": "alec@stephensai.co",
  "calendly": "https://calendly.com/alecpstephens/30min",
  "github": "https://github.com/alecstephens3-stack",
  "linkedin": "https://www.linkedin.com/in/alecpstephens/",
  "upwork": "https://www.upwork.com/freelancers/~0144c4c3757a94de2e",
  "jusheen_linkedin": "https://www.linkedin.com/in/jusheenkim",
  "updated": "2026-11-08"
};

export const ABOUT: About = {
  "name": "Alec Stephens",
  "role": "Applied AI engineer. Co-founder, Stephens AI.",
  "paragraphs": [
    "I build AI software that takes admin work off clinic staff, and I love doing it. In healthcare, patient data stays in the clinic's own AWS account, under its BAA.",
    "I made 200+ AI tutorial videos for a nine-figure education company. Before that I was hired in Seoul to write English lessons, and left with about 80% of the manual curriculum work handled by AI.",
    "I also take contracts as an applied AI or forward-deployed engineer."
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
    "slug": "claimstride",
    "tier": "full",
    "name": "ClaimStride",
    "kicker": "Eye care · insurance · HIPAA",
    "line": "Asks every insurer where each unpaid claim stands and writes the next step, for eye care and dental.",
    "client_short": "Wichita Family Vision",
    "status": "Live at an eye clinic",
    "results": [
      {
        "value": "1,140",
        "unit": "claims",
        "label": "read from the biller's real report, every total matching hers"
      },
      {
        "value": "About 2",
        "unit": "min",
        "label": "to get insurer status on 97 unpaid claims in AR",
        "basis": "The biller's first live run, on her real claims."
      }
    ],
    "flow": [
      {
        "step": "Read the claims report",
        "how": "ClaimStride reads the claims report the practice already exports, every format and every sheet. Nothing plugs into the practice software.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/claimstride/10-board.webp",
          "w": 1600,
          "h": 1200,
          "crop": [
            100,
            210,
            1400
          ]
        }
      },
      {
        "step": "Ask every insurer",
        "how": "Every unpaid claim goes to its insurer in one run, through a healthcare clearinghouse, and comes back with a clear status.",
        "shows": {
          "kind": "anim"
        }
      },
      {
        "step": "Sort by what's needed",
        "how": "Claims are sorted by what they need: denials grouped by reason and age, and the nearest filing deadlines first.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/claimstride/11-claim-detail.webp",
          "w": 1600,
          "h": 1200,
          "crop": [
            100,
            110,
            1400
          ]
        }
      },
      {
        "step": "Write the next step",
        "how": "Each claim gets its next step in plain words, with numbered steps and the timely filing deadline, so the biller knows what to fix and by when.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/claimstride/12-next-steps.webp",
          "w": 1600,
          "h": 1200,
          "crop": [
            110,
            190,
            1400
          ]
        }
      }
    ],
    "built": [
      {
        "lead": "Reads their own report",
        "text": "It works from the claims report the practice already exports, in every format and every sheet, at the eye clinic and the dental office. Nothing has to plug into the practice software."
      },
      {
        "lead": "Asks every insurer",
        "text": "Each unpaid claim goes to its insurer through a healthcare clearinghouse and comes back with one clear status: needs action, paid, pending, or not on file."
      },
      {
        "lead": "A next step on every claim",
        "text": "Where the insurer or its payment file gives a reason, ClaimStride writes it in plain words, with numbered steps and the timely filing deadline, so the biller knows what to fix and by when."
      },
      {
        "lead": "The board the biller asked for",
        "text": "Primary, secondary and tertiary claims kept apart, denials sorted by reason and age, and the nearest deadlines first. The cost shows before every run, with a monthly limit."
      }
    ],
    "before_after": [
      {
        "k": "Why a claim hasn't paid",
        "before": "A portal or a call per claim",
        "after": "Asked of every insurer in one run"
      }
    ],
    "quote": {
      "text": "This all reads very accurate… it really truly gives you everything that you would need at a quick glance.",
      "who": "The biller, Wichita Family Vision"
    },
    "stack": [
      "Claude on AWS Bedrock",
      "Python",
      "FastAPI",
      "Stedi API",
      "X12 276/277",
      "X12 270/271",
      "AWS",
      "pytest"
    ],
    "eng": {
      "architecture": "A FastAPI service. Plain code parses the report and every X12 answer; Claude on Bedrock reads scanned EOBs. Same claim, same status.",
      "choice": "Exported reports instead of a vendor integration, so it runs on day one. No electronic answer means a call, never a guess.",
      "tests": "2,596 automated tests.",
      "cost": "About 30 cents a check.",
      "runs_where": "The clinic's own AWS account, under its BAA."
    },
    "repos": [],
    "role": "My co-founder built the first version. I rebuilt how it reads insurer answers and built the eye care side.",
    "media": {
      "animation": {
        "scene": "claimstride-board",
        "w": 720,
        "h": 420,
        "title": "The ClaimStride board sorting a sample clinic's unpaid claims by what needs action",
        "caption": "Claims sorted by what needs action.",
        "poster": {
          "desktop": {
            "src": "/alec/img/claimstride/anim-claimstride-board-desktop.webp",
            "w": 1440,
            "h": 840
          },
          "phone": {
            "src": "/alec/img/claimstride/anim-claimstride-board-phone.webp",
            "w": 780,
            "h": 776
          }
        }
      },
      "hero": {
        "src": "/alec/img/claimstride/10-board.webp",
        "w": 1600,
        "h": 1200,
        "alt": "The ClaimStride board for a sample eye clinic: open claims by age in colored cards, and an age table split by primary, secondary and tertiary",
        "caption": "Sample clinic, made-up patients."
      },
      "gallery": [
        {
          "src": "/alec/img/claimstride/11-claim-detail.webp",
          "w": 1600,
          "h": 1200,
          "alt": "The denials list for a sample clinic, filtered by how each claim was denied, with one denied claim opened",
          "caption": "Denials, sorted by reason."
        },
        {
          "src": "/alec/img/claimstride/12-next-steps.webp",
          "w": 1600,
          "h": 1200,
          "alt": "A denied sample claim opened with the reason in plain words, numbered steps and the appeal deadline",
          "caption": "A denial's steps and deadline."
        }
      ]
    },
    "links": []
  },
  {
    "slug": "agents",
    "tier": "full",
    "name": "Computer-use agents",
    "kicker": "Medical practice · AI agents",
    "line": "Two Claude agents that work a medical practice's software through its screen, because a single office can't get an API.",
    "client_short": "A medical practice",
    "status": "Passing practice runs",
    "results": [],
    "flow": [
      {
        "step": "Read the day's list",
        "how": "Each run starts from the practice software's own report, so the agent works from the same list the staff would.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/agents/01-report-viewer.webp",
          "w": 1280,
          "h": 800,
          "crop": null
        }
      },
      {
        "step": "One at a time",
        "how": "Code hands the model one item at a time in a short, fresh conversation, so a mistake on one chart can't carry into the next.",
        "shows": {
          "kind": "anim"
        }
      },
      {
        "step": "Code verifies each click",
        "how": "Code checks every click against what the screen shows. Asked to discard someone else's unsaved note, the agent answers No.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/agents/02-unsaved-note.webp",
          "w": 1280,
          "h": 800,
          "crop": null
        }
      },
      {
        "step": "Re-run to confirm",
        "how": "A second pass confirms the work from the practice app's own record. Routine clicks replay without the AI and stop the moment the screen changes.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/agents/03-payment-repost-popup.webp",
          "w": 1280,
          "h": 800,
          "crop": null
        }
      }
    ],
    "built": [
      {
        "lead": "Payment files agent",
        "text": "It signs in to the practice software over Remote Desktop, exports the day's ERAs (insurance payment files) and hands them to ClaimStride, so payments are read without anyone opening a menu."
      },
      {
        "lead": "Chart sign-off agent",
        "text": "It works the doctor's sign-off queue one chart at a time: it opens the exam, signs it, marks the visit's tests reviewed, and leaves anything unusual on a short list for the doctor."
      },
      {
        "lead": "Guards in code, not the prompt",
        "text": "Code keeps the list, the budget and the record of every step. The agent can't report a click it hasn't seen the result of, and it answers No when asked to discard someone else's note."
      },
      {
        "lead": "Repeat jobs, no AI",
        "text": "Routine clicks it has learned replay with no model at all, so they cost nothing to run. The moment the screen looks different, replay stops and the agent takes over again."
      }
    ],
    "before_after": [
      {
        "k": "Payment files",
        "before": "Stuck inside the practice software",
        "after": "Exported for ClaimStride by an agent"
      },
      {
        "k": "Chart sign-off",
        "before": "Clicked through by hand each weekend",
        "after": "Exceptions left for the doctor"
      }
    ],
    "quote": null,
    "stack": [
      "Claude computer use",
      "Python",
      "Playwright",
      "FreeRDP",
      "AWS Systems Manager",
      "pytest"
    ],
    "eng": {
      "architecture": "Code keeps the list, the budget and the record. The model gets one short conversation per item, so a mistake can't carry into the next.",
      "choice": "Guards live in code, not the prompt. A report sent in the same turn as a click is refused: it describes a screen the model hasn't seen.",
      "tests": "Scored from the practice app's own record. A sloppy script has to fail the scorer.",
      "runs_where": "A cloud computer we manage, with no inbound ports."
    },
    "repos": [
      {
        "label": "computer-use-agents",
        "url": "https://github.com/alecstephens3-stack/computer-use-agents"
      }
    ],
    "role": "I built both agents, the practice app they're scored on and the cloud computer they run on.",
    "media": {
      "animation": {
        "scene": "chart-signoff",
        "w": 720,
        "h": 420,
        "title": "The chart sign-off agent working through a practice queue of charts",
        "caption": "The sign-off agent on a practice copy with made-up patients.",
        "poster": {
          "desktop": {
            "src": "/alec/img/agents/anim-chart-signoff-desktop.webp",
            "w": 1440,
            "h": 840
          },
          "phone": {
            "src": "/alec/img/agents/anim-chart-signoff-phone.webp",
            "w": 780,
            "h": 620
          }
        }
      },
      "hero": {
        "src": "/alec/img/agents/01-report-viewer.webp",
        "w": 1280,
        "h": 800,
        "alt": "The report the queue agent reads first, in the public practice app with made-up data",
        "caption": "The report the agent reads first."
      },
      "gallery": [
        {
          "src": "/alec/img/agents/02-unsaved-note.webp",
          "w": 1280,
          "h": 800,
          "alt": "A pop-up offering to discard another user's unsaved note, in the practice app",
          "caption": "Asked to discard someone else's note, it answers No."
        }
      ]
    },
    "links": []
  },
  {
    "slug": "invoice-agent",
    "tier": "full",
    "name": "Invoice processing system",
    "kicker": "Eye care · bookkeeping · HIPAA",
    "line": "Each vendor bill is read, filed and entered in QuickBooks in one click, so the bookkeeper never keys one by hand.",
    "client_short": "Wichita Family Vision",
    "status": "Live since Oct 2026",
    "results": [
      {
        "value": "About 200",
        "unit": "hrs/yr",
        "label": "of keying and filing off the bookkeeper's desk",
        "basis": "50 invoices a week at about 5 minutes each."
      },
      {
        "value": "0",
        "unit": "failures",
        "label": "since go-live, and she has never had to undo a bill",
        "basis": "QuickBooks' own reader got 40% of totals wrong in our test. Ours got every one right."
      }
    ],
    "flow": [
      {
        "step": "PDF lands in folder",
        "how": "A vendor bill lands in her Invoices folder as a PDF or a scan, exactly as it does today. Nothing changes about how bills arrive.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/invoice-agent/01-review-table-v35.webp",
          "w": 1600,
          "h": 1200,
          "crop": [
            30,
            216,
            820
          ]
        }
      },
      {
        "step": "Claude reads it",
        "how": "Claude on AWS Bedrock reads each page inside the clinic's own AWS account, under its BAA. The model only reads; it decides nothing.",
        "shows": {
          "kind": "anim"
        }
      },
      {
        "step": "Her rules decide",
        "how": "Plain code applies her filing rules: statement, invoice and card-paid vendors each go their own way, and possible duplicates come to her first.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/invoice-agent/01-review-table-v35.webp",
          "w": 1600,
          "h": 1200,
          "crop": [
            760,
            200,
            840
          ]
        }
      },
      {
        "step": "Entered on one click",
        "how": "She checks one table and clicks once. Each bill is renamed, filed and entered in QuickBooks, and every run can be undone.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/invoice-agent/02-result-v35.webp",
          "w": 1600,
          "h": 1200,
          "crop": [
            80,
            150,
            1440
          ]
        }
      }
    ],
    "built": [
      {
        "lead": "One review table",
        "text": "Every PDF in the Invoices folder is read and shown on one page: new file name, vendor folder, date, amount, QuickBooks vendor and account, prefilled from 12 months of her own coding."
      },
      {
        "lead": "Her rules, in code",
        "text": "Statement vendors, invoice-by-invoice vendors and card-paid vendors each follow her rule. Anything that might already be in QuickBooks is shown to her instead of entered twice."
      },
      {
        "lead": "Straight into QuickBooks",
        "text": "Bills and card expenses go in through the QuickBooks API from our own read, so QuickBooks never re-reads a page. A bill that can't go in yet waits, then goes in with one click."
      },
      {
        "lead": "Looks after itself",
        "text": "Signed updates install when she closes the app, every run can be undone, and an error report reaches us the moment something goes wrong. When a vendor rule changes, the update keeps the old rules too."
      }
    ],
    "before_after": [
      {
        "k": "Filing the PDF",
        "before": "Dragged into 1 of 184 folders",
        "after": "Renamed and filed on the same click"
      }
    ],
    "quote": {
      "text": "I think that's very simple and effective… I don't have to enter [them].",
      "who": "Mary Tangney, Bookkeeper, Wichita Family Vision"
    },
    "stack": [
      "Claude on AWS Bedrock",
      "Python",
      "QuickBooks Online API",
      "PyMuPDF",
      "CloudWatch"
    ],
    "eng": {
      "architecture": "A one-file Windows app. Claude on Bedrock only reads each PDF; deterministic code does the rest, through to the QuickBooks API.",
      "choice": "The model only extracts fields. Matching, accounts, duplicate checks and filing are plain code from her rules, so the same bill always lands the same way.",
      "tests": "40 offline QuickBooks cases and 25 browser checks.",
      "cost": "About 1 cent an invoice.",
      "runs_where": "Her PC and the clinic's AWS account."
    },
    "repos": [
      {
        "label": "bill-intake",
        "url": "https://github.com/alecstephens3-stack/bill-intake"
      }
    ],
    "role": "I built the app and its QuickBooks integration.",
    "media": {
      "animation": {
        "scene": "file-invoices",
        "w": 720,
        "h": 390,
        "title": "File Invoices reading three bills: two go into QuickBooks, one waits for the bookkeeper",
        "caption": "The odd bill waits for her.",
        "poster": {
          "desktop": {
            "src": "/alec/img/invoice-agent/anim-file-invoices-desktop.webp",
            "w": 1440,
            "h": 780
          },
          "phone": {
            "src": "/alec/img/invoice-agent/anim-file-invoices-phone.webp",
            "w": 780,
            "h": 712
          }
        }
      },
      "hero": {
        "src": "/alec/img/invoice-agent/01-review-table-v35.webp",
        "w": 1600,
        "h": 1200,
        "alt": "The review table with eight invented invoices: new file names, vendor folders, dates, amounts, QuickBooks vendor and account, and a note per row",
        "caption": "Her review table, invented invoices."
      },
      "gallery": [
        {
          "src": "/alec/img/invoice-agent/02-result-v35.webp",
          "w": 1600,
          "h": 1200,
          "alt": "The result page: entries made in QuickBooks, documents filed only, and one file left for her",
          "caption": "After Go."
        },
        {
          "src": "/alec/img/invoice-agent/03-needs-you-v35.webp",
          "w": 1600,
          "h": 1200,
          "alt": "A result page with one bill waiting because the vendor is not in QuickBooks yet",
          "caption": "One bill waiting."
        }
      ]
    },
    "links": []
  },
  {
    "slug": "knowledge-base",
    "tier": "full",
    "name": "Front desk knowledge base",
    "kicker": "Eye care · front desk",
    "line": "Anyone at the front desk finds the right answer in one search, without pulling a manager away.",
    "client_short": "Wichita Family Vision",
    "status": "Live since Aug 2026",
    "results": [
      {
        "value": "About 200",
        "unit": "hrs/yr",
        "label": "of front-desk time returned",
        "basis": "About 4 questions a day at 10 minutes each, now one search."
      },
      {
        "value": "35",
        "unit": "pages",
        "label": "plus a 41-price grid, kept current by the managers"
      }
    ],
    "flow": [
      {
        "step": "A caller asks",
        "how": "A caller asks something unusual, and whoever is at the desk can answer it during the call instead of putting them on hold.",
        "shows": {
          "kind": "anim"
        }
      },
      {
        "step": "Search one box",
        "how": "One search box across every page and price. It's plain search, not a chat box, so it can never invent a rule.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/knowledge-base/01-kb-home.webp",
          "w": 1600,
          "h": 1200,
          "crop": [
            100,
            0,
            1400
          ]
        }
      },
      {
        "step": "Answer on screen",
        "how": "Decision guides answer the tricky ones on screen: which doctor can see this patient, the right price, and whether to collect or bill.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/knowledge-base/04-kb-eligibility-tool.webp",
          "w": 1600,
          "h": 1200,
          "crop": [
            100,
            0,
            1400
          ]
        }
      },
      {
        "step": "Managers keep it current",
        "how": "Two managers keep it current right in the browser, with revision history and one-click restore. No developer needed for a content change.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/knowledge-base/02-kb-editing.webp",
          "w": 1600,
          "h": 1200,
          "crop": [
            100,
            0,
            1400
          ]
        }
      }
    ],
    "built": [
      {
        "lead": "Answers in one search",
        "text": "35 pages of front desk protocol in 7 sections and a live 41-price grid, on every front desk device and searchable from one box, with no AI to invent a rule."
      },
      {
        "lead": "Decision guides",
        "text": "Guides that bring the buried exceptions to the surface: which doctors a patient can see, the right price with prompt-pay, whether to collect or bill a refraction, and how urgent a symptom is."
      },
      {
        "lead": "Managers edit it themselves",
        "text": "Two managers edit any page in the browser, with revision history in plain English and one-click restore. No developer is needed for a content change."
      },
      {
        "lead": "Locked to the clinic",
        "text": "Only clinic Google logins get in, and only the two managers can edit. Pages are sanitized as they render, and a monthly export keeps a full backup."
      }
    ],
    "before_after": [
      {
        "k": "An unusual question",
        "before": "Interrupt a manager",
        "after": "One search, answered on the call"
      },
      {
        "k": "When someone leaves",
        "before": "Their know-how leaves too",
        "after": "It stays in the app"
      }
    ],
    "quote": {
      "text": "This is highly valuable, both in the short term and long term. It's already saving a lot of time.",
      "who": "Jill Romines, Front Office Manager, Wichita Family Vision"
    },
    "stack": [
      "Supabase",
      "Postgres RLS",
      "Google OAuth",
      "PWA",
      "Vercel",
      "DOMPurify"
    ],
    "eng": {
      "architecture": "A static PWA reading from Supabase. Row-level security lets everyone read and two named editors write.",
      "choice": "Row-level security, not app checks: only the two editors can write, whatever the browser sends.",
      "tests": "A no-dependency test suite gates every deploy. Pages sanitized at render.",
      "runs_where": "The front desk tablet and PCs."
    },
    "repos": [
      {
        "label": "supabase-team-knowledge-base",
        "url": "https://github.com/alecstephens3-stack/supabase-team-knowledge-base"
      }
    ],
    "role": "I built it, from the content model to in-app editing.",
    "media": {
      "animation": {
        "scene": "front-desk",
        "w": 720,
        "h": 420,
        "title": "The front desk knowledge base answering a question during a live call",
        "caption": "A caller's question, answered in seconds.",
        "poster": {
          "desktop": {
            "src": "/alec/img/knowledge-base/anim-front-desk-desktop.webp",
            "w": 1440,
            "h": 840
          },
          "phone": {
            "src": "/alec/img/knowledge-base/anim-front-desk-phone.webp",
            "w": 780,
            "h": 712
          }
        }
      },
      "hero": {
        "src": "/alec/img/knowledge-base/01-kb-home.webp",
        "w": 1600,
        "h": 1200,
        "alt": "The front desk knowledge base home screen: a search box, quick-pick chips, and the decision guides",
        "caption": "The home screen the front desk uses."
      },
      "gallery": [
        {
          "src": "/alec/img/knowledge-base/02-kb-editing.webp",
          "w": 1600,
          "h": 1200,
          "alt": "In-app editing with revision history",
          "caption": "Every edit kept."
        },
        {
          "src": "/alec/img/knowledge-base/04-kb-eligibility-tool.webp",
          "w": 1600,
          "h": 1200,
          "alt": "The provider eligibility decision guide",
          "caption": "A decision guide."
        },
        {
          "src": "/alec/img/knowledge-base/06-kb-on-tablet.webp",
          "w": 1600,
          "h": 1200,
          "alt": "The knowledge base installed on a tablet",
          "caption": "On the tablet."
        }
      ]
    },
    "links": []
  },
  {
    "slug": "pto-payroll",
    "tier": "full",
    "name": "PTO and payroll system",
    "kicker": "Eye care · operations",
    "line": "Staff request time off from a phone, the manager approves in one tap, and payroll prep builds itself every pay period.",
    "client_short": "Wichita Family Vision",
    "status": "Runs every pay period",
    "results": [
      {
        "value": "60 to 100",
        "unit": "hrs/yr",
        "label": "of admin time returned, and the paper process gone",
        "basis": "Slip handling, calendar checks and payroll prep."
      }
    ],
    "flow": [
      {
        "step": "Request on a phone",
        "how": "Staff request time off on one form from any phone, picking dates and a type, partial days included. The green paper slip is gone.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/pto-payroll/03-form-on-phone.webp",
          "w": 1600,
          "h": 1200,
          "crop": null
        }
      },
      {
        "step": "One-tap approval",
        "how": "The manager approves or denies with one tap from an email, in the office or anywhere else, with the request's details right there.",
        "shows": {
          "kind": "anim"
        }
      },
      {
        "step": "Calendar updates itself",
        "how": "Approved time off counts weekdays only, follows the clinic's rounding rule, and lands on the attendance sheet and the shared calendar by itself.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/pto-payroll/01-figure-flow.webp",
          "w": 1600,
          "h": 1200,
          "crop": [
            450,
            230,
            1080
          ]
        }
      },
      {
        "step": "Payroll report builds",
        "how": "Every pay period, a payroll report builds itself in a dated folder for the bookkeeper. No one prepares it from paper.",
        "shows": {
          "kind": "shot",
          "src": "/alec/img/pto-payroll/01-figure-flow.webp",
          "w": 1600,
          "h": 1200,
          "crop": [
            1040,
            700,
            560
          ]
        }
      }
    ],
    "built": [
      {
        "lead": "One form, any phone",
        "text": "Staff pick their dates and a type on one Google Form from any phone, partial days included. The request goes straight to the manager by email."
      },
      {
        "lead": "One-tap approval",
        "text": "The manager approves or denies from that email. The script counts weekdays only, rounds to the clinic's rule, checks department conflicts, and writes the attendance sheet and shared calendar."
      },
      {
        "lead": "Balances that can't drift",
        "text": "Accrual follows each hire anniversary, and every balance is recalculated from the grid on every change instead of added to, so a manual edit can never throw the totals off."
      },
      {
        "lead": "Payroll and new years",
        "text": "A payroll report lands in a dated folder for the bookkeeper every pay period, and next year's records for the whole staff are built with one click from the admin menu."
      }
    ],
    "before_after": [
      {
        "k": "Filing a request",
        "before": "A green paper slip",
        "after": "A form on any phone"
      },
      {
        "k": "Approving",
        "before": "In the office, on paper",
        "after": "One tap, from anywhere"
      }
    ],
    "quote": {
      "text": "It is already saving me some time, and I am getting information back to the team much quicker.",
      "who": "Gabe Walsh, Office Manager, Wichita Family Vision"
    },
    "stack": [
      "Apps Script",
      "Google Forms",
      "Sheets",
      "Calendar",
      "clasp",
      "Node"
    ],
    "eng": {
      "architecture": "A form trigger into Apps Script: date and accrual math, sheet and calendar writes, a timed payroll builder.",
      "choice": "Apps Script over a hosted app: the clinic already pays for Google Workspace, and the data never leaves.",
      "tests": "A 22-check programmatic suite.",
      "runs_where": "Inside the clinic's own Google Workspace."
    },
    "repos": [
      {
        "label": "apps-script-pto-payroll",
        "url": "https://github.com/alecstephens3-stack/apps-script-pto-payroll"
      }
    ],
    "role": "I built the engine, the migration and the payroll report.",
    "media": {
      "animation": {
        "scene": "time-off",
        "w": 720,
        "h": 450,
        "title": "A time off request sent from a phone, approved from the manager's email",
        "caption": "Asked on a phone, approved from an email.",
        "poster": {
          "desktop": {
            "src": "/alec/img/pto-payroll/anim-time-off-desktop.webp",
            "w": 1440,
            "h": 900
          },
          "phone": {
            "src": "/alec/img/pto-payroll/anim-time-off-phone.webp",
            "w": 780,
            "h": 712
          }
        }
      },
      "hero": {
        "src": "/alec/img/pto-payroll/01-figure-flow.webp",
        "w": 1600,
        "h": 1200,
        "alt": "Diagram: one form feeds an Apps Script engine that writes the attendance sheet, shared calendar, approval email, balances, and payroll report",
        "caption": "One form, one engine."
      },
      "gallery": [
        {
          "src": "/alec/img/pto-payroll/02-pto-approval-email.webp",
          "w": 1600,
          "h": 1200,
          "alt": "The approve or deny email",
          "caption": "One-tap approval."
        },
        {
          "src": "/alec/img/pto-payroll/03-form-on-phone.webp",
          "w": 1600,
          "h": 1200,
          "alt": "The request form on a phone",
          "caption": "The form."
        }
      ]
    },
    "links": []
  },
  {
    "slug": "aios",
    "tier": "short",
    "name": "Our AI operating system",
    "kicker": "Stephens AI · internal",
    "line": "The system our company runs on every day. Anything we install for a client runs here first.",
    "client_short": "Stephens AI",
    "status": "In daily use",
    "results": [
      {
        "value": "12",
        "unit": "agents",
        "label": "each with least-privilege permissions, plus 47 skills"
      }
    ],
    "flow": [],
    "built": [
      {
        "lead": "The Bridge",
        "text": "One dashboard over the whole company: a 3D map of every note, both calendars, both inboxes, messages and meetings, and a chat over the knowledge base that can read but never send."
      },
      {
        "lead": "Specialist agents",
        "text": "Agents on least-privilege tool lists: reviewers that read like a dentist or an optometrist, research, meeting notes. Reusable skills cover proposals, QA, deploys and reporting."
      },
      {
        "lead": "Jobs that run themselves",
        "text": "A daily meeting sweep writes the notes, updates the week's priorities, logs decisions and texts the action items. A weekly health check keeps the knowledge base clean, and every run leaves a log."
      }
    ],
    "before_after": [],
    "quote": null,
    "stack": [
      "Claude Code",
      "Claude Code headless",
      "MCP",
      "Python",
      "Three.js"
    ],
    "eng": {
      "architecture": "A markdown vault as the database; agents and skills as files with allow-lists.",
      "choice": "Files over a database: every agent and person can read them, all in git.",
      "tests": "Tested guard scripts and a weekly vault lint."
    },
    "repos": [
      {
        "label": "claude-code-operating-system",
        "url": "https://github.com/alecstephens3-stack/claude-code-operating-system"
      },
      {
        "label": "claude-code-voice-mod",
        "url": "https://github.com/alecstephens3-stack/claude-code-voice-mod"
      },
      {
        "label": "lens-design-system",
        "url": "https://github.com/alecstephens3-stack/lens-design-system"
      }
    ],
    "role": "I built all of it.",
    "media": {
      "animation": null,
      "hero": {
        "src": "/alec/img/aios/01-bridge-brain-view.webp",
        "w": 1600,
        "h": 1200,
        "alt": "The Bridge dashboard: a 3D graph of the vault beside today's calendar and inbox",
        "caption": "The Bridge, our company dashboard."
      },
      "gallery": []
    },
    "links": []
  },
  {
    "slug": "ai-lab",
    "tier": "short",
    "name": "AI Lab content systems",
    "kicker": "AI education · content",
    "line": "AI tutorials for a nine-figure education company, on a pipeline I built.",
    "client_short": "AI Lab, iPhone Photography School",
    "status": "Mar to Sep 2026",
    "results": [
      {
        "value": "200+",
        "unit": "videos",
        "label": "teaching AI to non-technical adults"
      }
    ],
    "flow": [],
    "built": [
      {
        "lead": "Idea engine",
        "text": "New video ideas are checked against everything already made, researched first, then scored on a rubric with hard gates, so only strong ideas reach a script."
      },
      {
        "lead": "Publishing in one command",
        "text": "Upload into the right Wistia series, a loudness check before members hear it, the tracker updated and the thumbnail set. A newsletter builder stages each send for a person to approve."
      },
      {
        "lead": "Across models",
        "text": "I taught Grok on the X API alongside Claude and OpenAI, and built the shared context so Claude Code and Codex worked from the same rules."
      }
    ],
    "before_after": [],
    "quote": {
      "text": "You have the double skill set, which is the AI itself plus presenting, and that is more valuable than just the AI.",
      "who": "Emils Pakarklis, Founder, iPhone Photography School"
    },
    "stack": [
      "Claude Code",
      "Codex",
      "MCP",
      "Wistia API",
      "X API"
    ],
    "eng": {
      "architecture": "Shared context files for Claude Code and Codex, feeding scripts, publishing, newsletters and a weekly KPI report.",
      "choice": "Models draft, a person publishes.",
      "tests": "A lint on the KPI report."
    },
    "repos": [],
    "role": "I built it as the in-house Applied AI Engineer.",
    "media": {
      "animation": null,
      "hero": {
        "src": "/alec/img/ai-lab/01-figure-architecture.webp",
        "w": 1600,
        "h": 1200,
        "alt": "Diagram: a shared context layer feeding the idea engine, publishing pipeline, newsletter builder, and KPI report",
        "caption": "One context layer, two coding agents.",
        "phone": {
          "src": "/alec/img/ai-lab/01-figure-architecture-phone.webp",
          "w": 780,
          "h": 2364
        }
      },
      "gallery": []
    },
    "links": []
  },
  {
    "slug": "coaching-aios",
    "tier": "short",
    "name": "Coaching practice AI system",
    "kicker": "Coaching · solo founder",
    "line": "AI agents for a one-person coaching practice, all reading one document she edits in plain English.",
    "client_short": "Workthentic",
    "status": "Delivered",
    "results": [],
    "flow": [],
    "built": [
      {
        "lead": "One brain document",
        "text": "Her voice, brand rules, client roster and policies live in one doc that every agent reads. She changes it by messaging a maintainer agent in plain English."
      },
      {
        "lead": "Agents for the busywork",
        "text": "Inbox triage that cites its source, scheduling replies drafted inside the task, voice notes split and routed, and meeting notes on a routine she owns."
      },
      {
        "lead": "Calendar to invoice",
        "text": "On the first of the month it reads both calendars, pulls client and service codes from the events, and writes the hours to a color-coded sheet ready for invoicing."
      }
    ],
    "before_after": [],
    "quote": {
      "text": "I'm so grateful for our time together. I feel like I was in a class… I learned so much.",
      "who": "Taima Ford Beyah, Founder, Workthentic"
    },
    "stack": [
      "Claude",
      "ClickUp Super Agents",
      "Google Calendar",
      "Google Sheets"
    ],
    "eng": {
      "architecture": "No-code agents in her project software, all reading one brain document.",
      "choice": "Native agents, so she can read and change every instruction herself.",
      "tests": "Regression tests on the maintainer agent's edit rules."
    },
    "repos": [],
    "role": "I built all of it, and she owns every piece.",
    "media": {
      "animation": null,
      "hero": {
        "src": "/alec/img/coaching-aios/01-figure-brain-and-agents.webp",
        "w": 1600,
        "h": 1200,
        "alt": "Diagram: one brain document read by four agents, with a maintainer agent as its only editor",
        "caption": "One document behind every agent.",
        "phone": {
          "src": "/alec/img/coaching-aios/01-figure-brain-and-agents-phone.webp",
          "w": 780,
          "h": 2170
        }
      },
      "gallery": []
    },
    "links": []
  },
  {
    "slug": "construction-site",
    "tier": "short",
    "name": "Construction company website",
    "kicker": "Construction · Japan",
    "line": "A readable redesign for a Japanese construction company, with an editor so their office can change the site themselves.",
    "client_short": "Kamata Koumuten",
    "status": "Live since Oct 2026",
    "results": [],
    "flow": [],
    "built": [
      {
        "lead": "A redesign in their language",
        "text": "A slow-moving hero over a finished driveway and gate, the company's history, what they build, and the serif and sans type pair the owner already knew."
      },
      {
        "lead": "Real jobs up front",
        "text": "Their own projects, each with a before and after switch under the photo, plus the story of the university rocket team whose engine test they hosted on their land."
      },
      {
        "lead": "They edit it",
        "text": "Words and photos on every page change in the browser, with undo. Every update deploys with a backup first and a health check on every page."
      }
    ],
    "before_after": [
      {
        "k": "The smallest text",
        "before": "Up to 88% under 14px",
        "after": "Large and readable"
      }
    ],
    "quote": null,
    "stack": [
      "HTML",
      "CSS",
      "JavaScript",
      "PHP",
      "Google Search Console"
    ],
    "eng": {
      "architecture": "Static pages on her own host; the editor saves back to the HTML.",
      "choice": "Our own small editor over a CMS: no licence, no build step.",
      "tests": "Editor and attack tests, plus a type-size test at 4 widths."
    },
    "repos": [],
    "role": "I built all of it.",
    "media": {
      "animation": null,
      "hero": {
        "src": "/alec/img/construction-site/01-v1-home-desktop.webp",
        "w": 1600,
        "h": 1200,
        "alt": "Kamata Koumuten homepage: the headline 地域と共に歩む。 over a sunny work site beside a finished house and gate",
        "caption": "The homepage."
      },
      "gallery": [
        {
          "src": "/alec/img/construction-site/02-v1-works-desktop.webp",
          "w": 1600,
          "h": 1200,
          "alt": "Project gallery with real photos of a carport job and a retaining wall job, each with a before and after switch",
          "caption": "Real jobs, before and after."
        },
        {
          "src": "/alec/img/construction-site/03-v1-home-phone.webp",
          "w": 1600,
          "h": 1200,
          "alt": "Two phone screens: the hero with contact buttons, and a project photo with its before and after switch",
          "caption": "Built for the phone."
        }
      ]
    },
    "links": [
      {
        "label": "kamata-koumuten.co.jp",
        "url": "https://kamata-koumuten.co.jp"
      }
    ]
  },
  {
    "slug": "lead-finder",
    "tier": "short",
    "name": "Pharmacy lead finder",
    "kicker": "Healthcare · lead generation",
    "line": "One sentence in his own Claude returns a sheet of compounding pharmacies, each with its published email.",
    "client_short": "Medari Advisors",
    "status": "Delivered",
    "results": [],
    "flow": [],
    "built": [
      {
        "lead": "Lists from the registry",
        "text": "A starting list for each state from the national provider registry: every active compounding pharmacy, with chains, grocery stores, hospitals and clinics removed, and the owner or pharmacist in charge as the contact."
      },
      {
        "lead": "A lookup in his account",
        "text": "One Google Maps search per pharmacy in his own Apify account, reading the contact details each pharmacy's website publishes."
      },
      {
        "lead": "A finished sheet",
        "text": "Junk and head-office addresses dropped, one email per pharmacy, his existing list removed, and stores with no website kept as a call list with phone numbers."
      }
    ],
    "before_after": [],
    "quote": {
      "text": "This is great. Thanks for the explainer video, well done! I have installed the plug-in and it's working.",
      "who": "Curtis Cole, CEO, Medari Advisors"
    },
    "stack": [
      "Claude plugin",
      "Python",
      "NPI Registry API",
      "Apify"
    ],
    "eng": {
      "architecture": "A Claude plugin; Python scripts decide, the model drives the run.",
      "choice": "Code accepts an email only on a registry phone or name-and-town match, never a guess.",
      "tests": "Script tests built from a real run."
    },
    "repos": [],
    "role": "I built it, from the spec call to the plugin and walkthrough video.",
    "media": {
      "animation": null,
      "hero": {
        "src": "/alec/img/lead-finder/01-figure-how-it-finds-leads.webp",
        "w": 1600,
        "h": 900,
        "alt": "Diagram: he asks his Claude for compounding pharmacy leads; a registry list, a Google Maps lookup and a match rule in code produce a sheet with one email per pharmacy",
        "caption": "One sentence in, a sheet of pharmacies out.",
        "phone": {
          "src": "/alec/img/lead-finder/01-figure-how-it-finds-leads-phone.webp",
          "w": 780,
          "h": 1768
        }
      },
      "gallery": []
    },
    "links": []
  }
];

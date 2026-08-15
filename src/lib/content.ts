/**
 * Site content, v4 (clinics). One file so copy can be edited without touching
 * layout. Voice: plain language, no em dashes in client-facing copy, no invented
 * numbers, no tool names in buyer-facing lines, and never gender a staff role.
 * The product is a front desk knowledge base (never use the old p-word for it).
 * Prices: Alec's 2026-08-14 direction (below the internal card). WFV facts:
 * clients/WFV/wfv-core.md. Pricing model: artifacts/pricing-knowledge-base-and-enablement-2026-08-01.html
 */

export const SITE_NAME = "Stephens AI";
export const SITE_URL = "https://stephensai.co";
export const CONTACT_EMAIL = "alec@stephensai.co";
export const CALENDLY = "https://calendly.com/alecpstephens/30min";

export const SITE_DESCRIPTION = "We build independent eyecare practices a searchable knowledge base that holds the insurance rules, prices, and protocols the front desk keeps in their heads. It is live in a 27-person clinic and holds no patient data.";

export const NAV_LINKS = [
  {
    "label": "Home",
    "href": "/"
  },
  {
    "label": "What we build",
    "href": "/#product"
  },
  {
    "label": "Proof",
    "href": "/#proof"
  },
  {
    "label": "Pricing",
    "href": "/#pricing"
  },
  {
    "label": "FAQ",
    "href": "/#faq"
  }
];

export const HERO = {
  "headline": {
    "lead": "Your front desk can find the answer",
    "accent": "in one place",
    "tail": "instead of asking around."
  },
  "sub": "We build independent eyecare practices a searchable knowledge base for the insurance rules, prices, and protocols their teams need. The system is already in daily use at a working front desk. Office managers can update answers as policies change, while we handle implementation, staff training, and ongoing support.",
  "primaryCta": {
    "label": "See pricing",
    "href": "/#pricing"
  },
  "secondaryCta": {
    "label": "Book a 20-minute call",
    "href": "https://calendly.com/alecpstephens/30min"
  },
  "trustLine": "It holds no patient data, and we sign a BAA before we start."
};

export const PROBLEMS = [
  {
    "title": "The hard questions all go through one or two people",
    "body": "Several times a day someone puts a patient on hold and walks to the office manager's desk. Two people stop working. The answer was written down somewhere, just not anywhere you can find it while a patient waits on the line."
  },
  {
    "title": "Nobody is sure which price is current",
    "body": "This is what we found at the practice we built this for: four price lists stacked in one spreadsheet. When the answer is unclear the front desk guesses, and the guess turns up later as an uncollected charge or a surprise balance at checkout."
  },
  {
    "title": "New hires take months to get up to speed",
    "body": "Turnover at the front desk is normal. Losing months of training every time is not. The knowledge exists. It just lives in a few people's heads and a binder nobody has updated since the last insurance change."
  }
];

export const PRODUCT_FEATURES = [
  {
    "title": "Every situation written down and searchable",
    "body": "Your protocols become short situation pages your team can find mid-call. One search box returns an answer in a few seconds, instead of a folder to dig through."
  },
  {
    "title": "Decision lookups for the calls that cost money",
    "body": "A few decisions do most of the damage when they go wrong: how soon a caller needs to be seen, which doctor can see them, whether to collect or bill the refraction, and this year's price. Each one gets a short guided lookup that shows the buried exception instead of relying on someone to remember it. On anything clinical it is a reference, never a substitute for judgment. Your doctor signs off on every clinical page before it goes live and again when it changes."
  },
  {
    "title": "Your office manager keeps it current",
    "body": "A price changes, your office manager updates the page, and it is live. There is no ticket and no waiting on us. Every edit is saved, so a wrong change is one click back."
  },
  {
    "title": "Access stays inside your practice",
    "body": "Staff sign in with their practice Google account. Nobody outside the domain can open it, and only the people your practice approves can edit. The system holds no patient records."
  },
  {
    "title": "Installs on the front desk computers",
    "body": "It installs from the browser with no admin rights and no ticket to your IT vendor. Pages your team has already opened keep working if the internet drops, which matters at a front desk that cannot stop taking calls."
  },
  {
    "title": "Staff flag a problem in one click",
    "body": "When a page is wrong or missing, whoever found it says so from inside the app and you see it. At the practice we built this for, the first four were fixed within a day."
  }
];

export const PROOF = {
  "title": "Hundreds of hours spent getting the details right",
  "body": [
    "We built and refined this system with direct input from clinic owners, doctors, office managers, and front-desk staff. At the live 27-person practice, where 6 to 7 doctors work from one location, the product was shaped by real clinic documents, days spent watching the front desk, and 76 situations mapped from the questions staff actually face.",
    "That work is already built into the product. Your team does not start from an empty template or spend months writing pages. We handle the document review, interviews, writing, access setup, testing, training, and rollout."
  ],
  "stats": [
    {
      "value": "76",
      "label": "Front desk situations mapped"
    },
    {
      "value": "4",
      "label": "Decision lookups built"
    },
    {
      "value": "60 to 100",
      "label": "Admin hours a year returned by the time-off build"
    },
    {
      "value": "0",
      "label": "Patient records in the system"
    }
  ]
};

export const PRICING_TIERS = [
  {
    "name": "Front desk knowledge base",
    "setup": "$2,500",
    "monthly": "$299",
    "monthlyBasis": "per month",
    "summary": "The front desk's knowledge, written up and searchable, kept current by your office manager.",
    "features": [
      "Up to 30 situation pages, written by us from your material",
      "4 decision lookups",
      "Search, in-app editing, and a saved history of every change",
      "Google sign-in, with editors you choose",
      "A one-click way for staff to flag a problem",
      "Installs on the front desk computers"
    ],
    "highlighted": false
  },
  {
    "name": "Whole-practice knowledge base",
    "setup": "$3,500",
    "monthly": "$250",
    "monthlyBasis": "per month",
    "summary": "The whole floor, not just the front desk: technicians, optical, and each doctor's rules.",
    "features": [
      "Everything in the front desk tier",
      "Up to 70 pages and 6 decision lookups",
      "Technician, optical, and doctor-restriction pages",
      "Views that show each role its own work",
      "A content review with your office manager each quarter",
      "A short written AI-use policy for your staff"
    ],
    "highlighted": true,
    "badge": "Where we would start you"
  },
  {
    "name": "Knowledge base plus operations",
    "setup": "$4,500",
    "monthly": "$350",
    "monthlyBasis": "per month",
    "summary": "The knowledge base plus operations work like time-off and payroll automation, with us on call every month.",
    "features": [
      "Everything in the whole-practice tier",
      "Time-off and payroll automation, scoped to your practice",
      "A quarterly practice snapshot",
      "Monthly working time with both of us",
      "Your builds go to the front of our queue"
    ],
    "highlighted": false
  }
];

export const PRICING_NOTES = [
  "Extra sections beyond a tier's cap are $600 each.",
  "A second location is $1,500 to set up and $149 per month.",
  "Clinical pages go live only after your doctor signs off.",
  "No long-term contract. Cancel any time and keep every page."
];

export const TIMELINE = [
  {
    "week": "Week 1",
    "title": "Send us what you already have",
    "body": "You do not need to organize or rewrite anything first. We sort the protocols, price sheets, insurance notes, and the binder, resolve duplicates, and scope the build before you commit."
  },
  {
    "week": "Week 2",
    "title": "We learn how your front desk actually works",
    "body": "We meet with the people who answer the phone in a few short sessions scheduled around the clinic. Their input shapes the pages and decision lookups, so the system fits the work instead of forcing a new process on the team."
  },
  {
    "week": "Weeks 3 and 4",
    "title": "We write, secure, and test it",
    "body": "We write every page, build the decision lookups, and configure Google sign-in for approved staff. Your team reviews a working version, and we fix anything that is unclear before launch."
  },
  {
    "week": "Day 30",
    "title": "Live at the front desk",
    "body": "We install it on the front desk computers, train the office manager to make updates, and open the feedback channel. Staff get a finished system, not an empty platform they still have to build."
  }
];

export const OWNERSHIP = [
  {
    "q": "Who owns the content",
    "a": "You do. They are your practice's rules. We wrote them down. We do not own them."
  },
  {
    "q": "Can you export it",
    "a": "Yes, any time, as plain files you can open without us. Ask and we send it, no charge."
  },
  {
    "q": "What if we cancel",
    "a": "It is month to month, no term. You keep every page. You lose the search, and we will tell you the two easiest ways to get that back."
  },
  {
    "q": "What if you two disappear",
    "a": "You have the export, and the content reads fine without our software. Better you know that now than find out at a bad moment."
  }
];

export const FAQ = [
  {
    "q": "Does any patient data go into this?",
    "a": "No. It holds your rules, not your charts: insurance policies, pricing, scheduling protocols, procedures. There are no patient records in it, so there is nothing in it to breach. If a later project ever needs patient data, it runs inside your own accounts under a signed BAA, never on our systems. We sign the BAA before we start either way."
  },
  {
    "q": "Do we have to write all the content ourselves?",
    "a": "No, and this is the main difference between us and a training platform. Tools like Trainual and Whale hand you an empty system at $249 to $300 a month and you still write every page. We write the pages from the material you already have, then hand you the keys so your manager keeps them current."
  },
  {
    "q": "What if our practice management system isn't Compulink?",
    "a": "It does not connect to your practice management system, so it does not matter which one you run. That is on purpose. Most hosted systems, whether that is Compulink, RevolutionEHR, or Eyefinity, do not give an outside vendor database access. Any vendor promising a nightly sync into a hosted system is either overselling or has not checked yet."
  },
  {
    "q": "Who keeps it up to date after launch?",
    "a": "Your office manager, in the app, in about ten seconds. That is what the monthly fee protects. A knowledge base that goes stale becomes the exact problem it was built to solve, so the monthly pays for keeping it true, not for hosting."
  },
  {
    "q": "What does the monthly fee cover?",
    "a": "The writing, not the hosting. Hosting this costs almost nothing. When an insurance rule changes, a doctor's restrictions change, or your prices reset for the year, we update the pages and run the accuracy review, so it is our job rather than something your office manager does on a weekend. Compare it to a training platform, not to your practice management software: Trainual and Whale run about $249 to $300 a month at your size and still hand you an empty system to fill in yourself. If you would rather not pay it, you can cancel after launch, keep the exported content, and maintain it yourself."
  },
  {
    "q": "How long until staff are actually using it?",
    "a": "Live at day 30. Getting people to use it is a separate job and we treat it that way. The feedback button and the same-day fixes in the first two weeks are what turn it from a tool you bought into a tool they open."
  },
  {
    "q": "Who are we actually hiring?",
    "a": "Two people. Alec Stephens and Jusheen Kim, and you work with both of us, not an account manager. We are based in Asia, so we are not at a desk during your morning rush. Urgent issues get answered by the next business morning your time, and we put the escalation path in writing before you sign anything. We would rather state the limit than imply a promise we cannot keep."
  },
  {
    "q": "What happens if a page is wrong and it costs us money?",
    "a": "You review and approve every page before it goes live, and your doctor signs off on anything clinical. If we wrote it wrong against the source you gave us, we fix it free and tell you which other pages shared the mistake. If the underlying rule changed and nobody told either of us, that is what the monthly is for. A knowledge base does not remove the need for someone to own the answer. It removes the need for that person to be interrupted forty times a week."
  },
  {
    "q": "We run more than one location. Does that change things?",
    "a": "It usually makes the problem worse and the case stronger. More locations means more sets of tribal knowledge that drifted apart, staff who cover across sites and get a different answer at each one, and a weak spot at every front desk. We build the shared pages once and let each site override only what genuinely differs. A second location is $1,500 to set up and $149 a month."
  },
  {
    "q": "Why not just build this ourselves?",
    "a": "Some practices should. If you have someone in house with the time to interview the front desk, write 30 to 70 situation pages, build the decision lookups, and keep it current, you do not need us. What you are paying for is that nobody in your building has to spend the next three months on it."
  }
];

export const FOUNDERS = [
  {
    "name": "Alec Stephens",
    "role": "Co-founder",
    "image": "/images/headshot.png",
    "bio": "Spent the last year inside a 27-person eyecare practice, in the office, watching the front desk work. Most of what we build for clinics came out of that. Five-plus years and a 100% job success score on Upwork before this."
  },
  {
    "name": "Jusheen Kim",
    "role": "Co-founder",
    "image": "/images/headshot-jusheen.png",
    "bio": "Former lead software engineer at J.P. Morgan. Builds the systems that have to hold up under real use, and has worked with healthcare practices, solo operators, and software companies."
  }
];

export const OTHER_WORK = [
  {
    "title": "Business coaching practice",
    "body": "A full operating system: software agents handling inbox, scheduling, voice-note capture, meeting notes, and calendar-to-invoice.",
    "metric": "5 agents running daily operations"
  },
  {
    "title": "Construction company, Japan",
    "body": "A full site rebuild across six pages, search console set up, and a corrected business profile. Now on an upkeep retainer.",
    "metric": "Complete digital rebuild"
  },
  {
    "title": "Language test-prep company",
    "body": "AI worked into curriculum drafting, formatting, review cycles, and process automation.",
    "metric": "80% of the manual work cut"
  }
];

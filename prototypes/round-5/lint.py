#!/usr/bin/env python3
"""House rules gate for round 5 fragments.

Every rule here comes from a brief and has a failure mode someone already paid
for. Structural checks pass while a page is quietly wrong, so this exists to
catch the wrong that a screenshot cannot see. Screenshot QA is still required;
this does not replace it.

    python3 lint.py *.frag.html
"""
import pathlib, re, sys

CALENDLY = "https://calendly.com/alecpstephens/30min"
EMAIL = "alec@stephensai.co"

GUARANTEE = ("5+ exams booked from patients we contacted, within 30 days of "
             "the first message sent, or that month is free.")

# BRIEF-ROUND-2.md section 2. The ONLY quotes any page may print.
APPROVED_QUOTES = [
    "You are awesome! Thank you so much for your help!",
    "Thanks for the fixes on the PTO!",
    "Thank you for all of your help on this project.",
    "That looks good, exactly what Mary needs to process.",
    "I think the biggest issue will be getting in the habit of using the tool.",
]

HYPE = ["revolutionary", "seamless", "cutting edge", "cutting-edge", "game changing",
        "game-changing", "unlock", "supercharge", "empower", "effortless", "world class",
        "best in class", "state of the art"]

GENDERED = [r"\bshe at the front\b", r"\bhis office manager\b", r"\bher office manager\b",
            r"\bshe\b(?=[^<]{0,40}front desk)", r"\bhis\b(?=[^<]{0,40}front desk)"]

WRONG_NOUN = [r"\bplaybook\b", r"\bwiki\b", r"\bportal\b"]

# research/insurance-verification-viability.md: we write down the lookup path.
# We do NOT verify, check, or pull anything from a payer. Claiming otherwise
# reverses the finding and oversells.
VERIFICATION_CLAIMS = [
    r"we (check|verify|pull|confirm)[^.<]{0,30}(eligibilit|benefit|authoriz|coverage)",
    r"(automatic|real time|instant)[^.<]{0,24}(eligibilit|verificat)",
    r"verif(y|ies|ication) (your |their |the )?patients?[’']? (insurance|benefits|coverage)",
]

FORBIDDEN_NUMBERS = [
    (r"\$?285\b", "the ~$285 figure includes optical and is not to be used"),
    (r"\b\d{1,3}% (more|lift|increase) in (bookings|recall|revenue)\b", "vendor math"),
]

REQUIRED_FACTS = [
    (r"\b27 person\b|\b27-person\b", "the 27 person practice"),
    (r"\b76\b", "76 situations mapped"),
    (r"\b4 decision lookups\b|\b4 lookups\b", "4 decision lookups"),
    (r"\b60 to 100\b", "60 to 100 admin hours a year"),
]

PRICES = [
    (r"\$2,500\b", r"\$299\b"),
    (r"\$3,500\b", r"\$250\b"),
    (r"\$4,500\b", r"\$350\b"),
]


def strip_comments(s):
    return re.sub(r"<!--.*?-->", "", s, flags=re.DOTALL)


INLINE = "em|b|strong|i|u|span|a|small|sup|sub|code"


def visible_text(s):
    """Approximate what a reader sees.

    Inline tags close up with no space, block tags become one. Getting this
    wrong made an approved testimonial fail its own character-for-character
    check purely because one word inside it was wrapped in <em>.
    """
    s = strip_comments(s)
    s = re.sub(r"<style\b.*?</style>", "", s, flags=re.DOTALL | re.I)
    s = re.sub(r"<script\b.*?</script>", "", s, flags=re.DOTALL | re.I)
    s = re.sub(r"</?(?:" + INLINE + r")\b[^>]*>", "", s, flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", s).strip()


PARTS = pathlib.Path(__file__).resolve().parent / "_parts"
SHARED = {"KB": "kb.html", "REEXAM": "reexam.html",
          "TIMEOFF": "timeoff.html", "FAQ": "faq.html"}


def expand_shared(raw):
    """Splice the shared parts in, the way build.py will.

    Structural rules are checked against the fragment, but content rules have
    to be checked against the page the reader gets. The guarantee and the
    1,000 patient gate both live in a shared widget.
    """
    for name, filename in SHARED.items():
        f = PARTS / filename
        if f.exists():
            raw = raw.replace(f"<!-- SAI5:{name} -->", f.read_text())
    return raw


def check(path):
    raw = path.read_text()
    body = strip_comments(raw)
    text = visible_text(expand_shared(raw))
    errs, warns = [], []

    def err(m): errs.append(m)
    def warn(m): warns.append(m)

    # --- voice ------------------------------------------------------------
    if "—" in body or "–" in body:
        err(f"em or en dash present ({body.count('—')} em, {body.count('–')} en)")
    for h in HYPE:
        if re.search(r"\b" + re.escape(h) + r"\b", text, re.I):
            err(f"hype adjective: {h!r}")
    for pat in GENDERED:
        if re.search(pat, text, re.I):
            err(f"gendered staff role: {pat}")
    for pat in WRONG_NOUN:
        if re.search(pat, text, re.I):
            err(f"the product is a knowledge base, not a {pat}")
    if re.search(r"[\U0001F300-\U0001FAFF☀-➿]", body):
        err("emoji present")

    # --- structure --------------------------------------------------------
    for bad in ("<!DOCTYPE", "<html", "<head ", "<head>", "<body"):
        if bad.lower() in body.lower():
            err(f"document tag {bad!r}: the publisher wraps the file")
    if "<script" in body:
        err("fragment ships its own script; build.py adds the shared one")
    nights = len(re.findall(r"class=\"[^\"]*sai-night", body))
    if nights > 1:
        err(f"{nights} night sections; the maximum is 1 per page")
    panes = len(re.findall(r"class=\"[^\"]*sai-pane", body))
    streaks = len(re.findall(r"sai-streak", body))
    if streaks > panes:
        err(f"{streaks} streaks across {panes} panes; 1 per pane maximum")

    # --- shared parts -----------------------------------------------------
    for name in ("KB", "REEXAM", "TIMEOFF", "FAQ"):
        if f"SAI5:{name}" not in raw:
            err(f"missing the shared part marker SAI5:{name}")
    if "sai-btn ghost" in body and "kbq" in body:
        err("the knowledge base widget looks hand copied; use the SAI5:KB marker")

    # --- facts, prices, quotes -------------------------------------------
    for pat, what in REQUIRED_FACTS:
        if not re.search(pat, text, re.I):
            err(f"required fact missing: {what}")
    for setup, monthly in PRICES:
        if re.search(setup, text) and not re.search(monthly, text):
            err(f"tier price {setup} present without its monthly {monthly}")
    if "$600" not in text:
        warn("ReExam's $600 flat price is not on the page")
    if not re.search(r"\b1,000\b", text):
        warn("the 1,000 contactable lapsed patient gate is not stated")
    for pat, why in FORBIDDEN_NUMBERS:
        if re.search(pat, text, re.I):
            err(f"forbidden number: {why}")

    # guarantee, character for character
    if "exams booked" in text and GUARANTEE not in text:
        err("the guarantee is present but not character for character")

    # quotes: any sentence in curly or straight double quotes attributed as a
    # testimonial must be on the approved list
    for q in re.findall(r"[\"“]([^\"”<]{25,240})[\"”]", text):
        q = q.strip()
        if q in APPROVED_QUOTES or q == GUARANTEE:
            continue
        if re.search(r"\b(thank|thanks|awesome|great|love|amazing|recommend|habit)\b", q, re.I):
            err(f"unapproved testimonial-shaped quote: {q[:70]!r}")

    # --- the research finding --------------------------------------------
    for pat in VERIFICATION_CLAIMS:
        m = re.search(pat, text, re.I)
        if m:
            err(f"reads as an insurance verification claim: {m.group(0)[:60]!r}")

    # --- CTAs -------------------------------------------------------------
    if CALENDLY not in body:
        err("the Calendly CTA is missing")
    if EMAIL not in body:
        err("the email CTA is missing")

    # --- type floor in the fragment's own CSS -----------------------------
    for m in re.finditer(r"font-size:\s*([0-9.]+)px", body):
        if float(m.group(1)) < 13:
            err(f"font-size {m.group(1)}px is below the 13px floor")

    # --- pricing must not be in the hero ----------------------------------
    hero = re.search(r"<section[^>]*class=\"[^\"]*hero.*?</section>", body, re.DOTALL | re.I)
    if hero and re.search(r"\$[0-9]", visible_text(hero.group(0))):
        err("a price is in the hero")

    return errs, warns


def main(argv):
    paths = [pathlib.Path(a) for a in argv[1:]]
    if not paths:
        print(__doc__.strip())
        return 2
    bad = 0
    for p in sorted(paths):
        if not p.exists():
            print(f"  MISSING  {p}")
            bad += 1
            continue
        errs, warns = check(p)
        if not errs and not warns:
            print(f"  ok    {p.name}")
        else:
            print(f"  {'FAIL' if errs else 'warn'}  {p.name}")
            for e in errs:
                print(f"          ERROR  {e}")
            for w in warns:
                print(f"          warn   {w}")
        if errs:
            bad += 1
    print(f"\n{len(paths) - bad} of {len(paths)} clean")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))

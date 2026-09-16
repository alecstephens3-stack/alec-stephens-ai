# Publishing the v5 homepage (and rolling it back)

Runbook for shipping `feat/homepage-v5-office-manager` to stephensai.co, written
so either founder can run it cold. v5 is the "office manager" homepage picked on
Sep 16, 2026 from three candidates (SAI-43). Only the home route changes;
`/alec`, `/jp`, `/optometry` (redirect) and the contact form are untouched.

**Branch:** `feat/homepage-v5-office-manager`
**Static preview of the same design and copy:** https://stephensai-v2-office-manager.vercel.app
**Production project:** `alec-stephens-ai` (`prj_1WbtFkydGJYUrTxM3xi9nbinoWkT`,
team `alec-stephens-projects`). Pushing `main` deploys production. Nothing else to run.

---

## 1. Preview the real build (optional, recommended)

Pushing the branch makes Vercel build a preview deployment on the production
project. Its URL shows up on the GitHub PR and in the Vercel dashboard under
Deployments. Preview URLs on this project may sit behind Vercel's SSO gate; if
so, open it while logged in to Vercel, or use the static preview link above,
which has the same copy and design.

## 2. Publish

Open a PR from `feat/homepage-v5-office-manager` into `main` and merge it, or
from a clone:

```bash
git checkout main && git pull --ff-only
git merge --no-ff feat/homepage-v5-office-manager -m "feat(site): v5 homepage, office manager angle"
git push origin main
```

**Then verify, always:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://stephensai.co
curl -s https://stephensai.co | grep -o "Your clinic runs on a few people who"
curl -s -o /dev/null -w "/alec -> %{http_code}\n" https://stephensai.co/alec          # expect 200
curl -s -o /dev/null -w "/optometry -> %{http_code}\n" https://stephensai.co/optometry # expect 308
```

## 3. Roll back (two ways, both take about a minute)

**A. Vercel dashboard, no code.** Vercel keeps every production deployment.
Open the `alec-stephens-ai` project, then Deployments, find the last
deployment before the v5 merge (the old homepage, from commit `b2f1268` or a
later one on the old design), open its menu and choose **Promote to
Production** (older dashboards call this Instant Rollback). stephensai.co
serves the old site again within seconds. `main` still contains v5, so the
next push to main would bring v5 back; use option B if the code should match.

**B. Git.**

```bash
git checkout main && git pull --ff-only
git revert -m 1 <merge-commit-sha>     # the merge commit from step 2
git push origin main
```

Vercel redeploys the old homepage. The v5 work stays in history and on its
branch, so it can be re-merged later.

## 4. What changed in this branch

- `src/lib/content.ts`: all homepage copy (rewritten). Voice: plain, no em
  dashes, "tool" not "AI", never gender a staff role. Every number traces to
  the published case study (stephens-ai-front-desk-case-study.vercel.app).
- `src/components/sections/v5/*`: hero with quote card, day-at-the-desk sorting,
  case study with stats and a depiction of the tool, how a project goes,
  founders, FAQ, contact. Built from the existing Lens primitives.
- `src/app/page.tsx`: composes v5; JSON-LD keeps ProfessionalService and
  FAQPage, drops the price offers (there are no prices on the page).
- `src/app/layout.tsx`: title, description and keywords for the clinic-wide positioning.
- `src/components/layout/footer.tsx`: Case study, How we work, Alec's builds,
  LinkedIn (company page), Email.
- `src/components/sections/v4/*`: removed (still in git history).

## 5. Still open (decisions, not bugs)

- No prices on the page. Add a pricing section back once the two of you agree
  on numbers (the old site said $2,500 + $299/mo; the prototype said $4,500).
- `public/og-image.png` still carries the old hero line; regenerate when convenient.
- "Alec's builds" stays in the footer only; the top nav is clinic-only per
  the Curtis call (SAI-43).
- The quote is attributed to Jill Romines, Front Office Manager, matching the
  published case study. Confirm the naming approval covers the homepage.

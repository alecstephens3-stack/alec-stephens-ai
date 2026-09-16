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

## 3. Roll back

**A. Vercel dashboard, no code (Alec's login only).** Open the `alec-stephens-ai`
project, then Deployments, and use **Instant Rollback** on the current production
deployment. On the Hobby plan it can only go back one step, to the production
deployment right before the current one. While a rollback is active, new pushes
to `main` do not go live until someone clicks **Undo Rollback** in the same place.
Only members of the `alec-stephens-projects` team can do this. Jusheen's Vercel
login is not on the team, so Jusheen uses option B.

**B. Git (either founder).** Every homepage change lands as its own merge commit,
so undo them newest first:

```bash
git checkout main && git pull --ff-only
git revert -m 1 <merge-commit-sha>     # newest merge first
git push origin main
```

- Back to v5 (before the PDF shelf and depiction redraw): revert the v5.1 merge.
- Back to the old v4 site: revert the v5.1 merge, then `a8ec378` (the v5 merge).

On GitHub the same thing is one button: open the merged PR, click **Revert**, and
merge the PR it opens. Vercel redeploys either way, and the work stays in history
so it can be re-merged later.

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

## 6. v5.1: case study PDFs and copy edits (Sep 16, 2026)

Branch `feat/homepage-v5-1-case-studies`, on top of the v5 merge (`a8ec378`).

- Founders: removed the "registered in Kansas, we work from Asia" note.
- FAQ: "About two weeks to go live"; removed "What happens if you two disappear?".
  How we work, step 03, also says two weeks. The case study narrative no longer
  says six weeks, and the fourth stat is now "0 patient records", so the page
  never contradicts the FAQ.
- The case study depiction is redrawn in the front desk app's own sage colors:
  the search box, the answer page with its exception called out, and the four
  decision tools with icons.
- "Download the PDF" on the front desk case study, plus a "More case studies"
  shelf of three one-page PDFs: time off and payroll, vendor bills, admin tools.
  Files live in `public/case-studies/`. Only the front desk study names the
  clinic. The other three use plain descriptors, leave out eyecare and Kansas
  details (the vendor bills screenshot is trimmed to generic rows), and none of
  them claims to be a separate client. Every figure traces to Alec's published
  pages, his Sep 16 notes on the invoice tool, or the reviewed combined case study.
- `ButtonLink` gained a `download` prop for same-site files.
- The PDFs are generated by `build.py` in
  `~/Documents/automation_work/stephensai-landing/case-studies/` (Jusheen's machine).
  Edit the copy there and re-run it rather than editing the PDFs.

Verify after merging:

```bash
curl -s https://stephensai.co | grep -o "More case studies"
curl -s -o /dev/null -w "%{http_code}\n" https://stephensai.co/case-studies/vendor-bills.pdf   # expect 200
```

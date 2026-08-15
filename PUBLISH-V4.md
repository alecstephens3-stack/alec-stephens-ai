# Publishing the v4 site

Runbook for shipping `feat/site-v4-clinics` to stephensai.co. Written so
Charlie on Hermes can execute it from a text message, and so a fresh agent
can pick it up cold.

**Branch:** `feat/site-v4-clinics` (pushed to origin)
**Public preview:** https://sai-site-v4-c50e95.vercel.app
**Production project:** `alec-stephens-ai` (`prj_1WbtFkydGJYUrTxM3xi9nbinoWkT`,
team `alec-stephens-projects`)

The preview is a **throwaway Vercel project**, deliberately separate from
production so it has no SSO gate and Alec can open it on a phone. It is not
the thing that goes live. Publishing means promoting the branch on the real
project.

---

## To publish (Alec has said yes)

```bash
cd /Users/alecstephens/dev/stephens-ai/alec-stephens-ai
git checkout main && git pull --ff-only
git merge --no-ff feat/site-v4-clinics -m "feat(site): v4 rebuild, eyecare-first"
git push origin main
```

Pushing `main` is what deploys production. Vercel builds from the GitHub
integration; there is nothing else to run.

**Then verify, always:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://stephensai.co
curl -s https://stephensai.co | grep -o "When your best front desk person leaves"
curl -s -o /dev/null -w "/optometry -> %{http_code}\n" https://stephensai.co/optometry   # expect 308
```

## To make a copy change before publishing

Nearly all site copy is in one file: **`src/lib/content.ts`**. Headlines,
prices, FAQ answers, founder bios, the cost model's line items. Editing it
does not require touching any layout.

```bash
cd /Users/alecstephens/dev/stephens-ai/alec-stephens-ai
git checkout feat/site-v4-clinics
# edit src/lib/content.ts
npx eslint src && npm run build          # both must pass
git commit -am "copy: <what changed>"
git push
```

To refresh the shareable preview after a change:

```bash
DIR=/tmp/sai-preview-$(openssl rand -hex 3)
rsync -a --exclude node_modules --exclude .next --exclude .vercel --exclude .git \
      --exclude tsconfig.tsbuildinfo --exclude .DS_Store \
      /Users/alecstephens/dev/stephens-ai/alec-stephens-ai/ "$DIR"/
cd "$DIR" && npx vercel deploy \
  --token "$(cat ~/.vercel-token)" --scope alec-stephens-projects --yes
```

Redeploying the **same** project name (`sai-site-v4-c50e95`) keeps the same
public URL, so Alec's existing link stays valid. Set `"name"` in that copy's
`package.json` to `sai-site-v4-c50e95` before deploying to reuse it.

## To roll back

```bash
git revert -m 1 <merge-sha> && git push origin main
```

---

## Two things that must happen before this converts

Neither blocks the deploy. Both cost real money if they are forgotten.

1. **Resend sending domain.** Publishing is safe without this: the sender
   still defaults to `onboarding@resend.dev`, which works but only delivers to
   the Resend account owner's own address. The old silent-success bug is fixed
   either way, so a failed send now shows the visitor a real error instead of
   "Message sent."

   To take the limit off, in Resend: **Domains → Add Domain → `stephensai.co`**,
   then add the DNS records at Porkbun.

   > **Merge the SPF record, do not add a second one.** The apex already carries
   > Brevo (`v=spf1 ... include:spf.brevo.com ...`). A domain may have only one
   > SPF record and a second breaks both senders. Either fold
   > `include:_spf.resend.com` into the existing record, or use Resend's
   > `send.stephensai.co` subdomain flow, which leaves the apex alone.

   Once it shows **Verified**, set `CONTACT_FROM_EMAIL` in Vercel for Production
   and Preview. If you verified the subdomain rather than the apex, it must be
   `Stephens AI <hello@send.stephensai.co>`, because `hello@stephensai.co` will
   403 against a subdomain verification.

   **Then send one real test through the live form and confirm it arrives.**

2. **The named reference.** The strongest single upgrade left is a real
   practice name, a person, and permission to be called. The site currently
   says "Front office manager, on first use" because sign-off has not been
   asked for. Both the practice-owner and competitor reviewers called the
   anonymous attribution the biggest remaining credibility gap. Ask Gabe.

## What changed from v3, in one paragraph

The product we actually ship was not on the website. v4 makes the Front Desk
Playbook the offer instead of a case study, deletes the generalist section
that put HVAC and law firms next to a healthcare pitch, retires the $250 tier
that was capping the perceived value of everything above it, and publishes the
internal price card at $4,500 / $9,500 / $18,000. It also fixes three
production bugs found during the rebuild: glass that did not render outside
Safari, a mobile menu whose close button could not be tapped, and a contact
form that reported success when the email failed.

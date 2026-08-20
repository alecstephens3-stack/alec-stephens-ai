# Website prototypes: multi-product site for cold outreach

Seventeen prototype landing pages exploring how the site should showcase a catalogue of
products (front desk knowledge base, recall done for you, practice operations
automation) rather than the single offer the live v4 site sells today.

These are mock ups for a design decision, not production code. Nothing here is wired
into the Next.js app and nothing here deploys. Once a direction is chosen, it gets
rebuilt properly in `src/`.

## Files

- `BRIEF.md` — the shared source of truth every prototype was built against: product
  definitions, the facts that may be used, house voice rules, brand tokens, and the
  technical constraints.
- `NN-name.html` — the seventeen prototypes. Each is a self contained page: open it in a
  browser directly, no build step and no server.
- `index.html` — the review page. Start here. It frames what each prototype is betting
  on and links to all seventeen.

Each prototype opens with a grey bar naming the direction and its bet. That bar is
review furniture and would not ship.

## Viewing them

```bash
open prototypes/index.html          # macOS
python3 -m http.server -d prototypes 8080   # or serve the folder
```

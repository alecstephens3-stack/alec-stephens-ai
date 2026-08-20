# brand-assets

`src/app/globals.css` has always named its canonical source as
`brand-assets/stephens-ai-design-system/tokens/tokens.css`. That path did not
exist in this repo and never had, so anything built from `globals.css` alone was
working off a partial copy of the tokens with none of the component vocabulary.

`stephens-ai-lens-v3/` is the real kit, added 2026-08-19. Read
`DESIGN-SYSTEM.md` and `kit/SNIPPETS.md`; the source of truth for the CSS is
`kit/lens-kit.css`.

Do not hand-write the system into a file. Put the markers in and run the script:

```bash
cp brand-assets/stephens-ai-lens-v3/kit/starter.html my-thing.html
python3 brand-assets/stephens-ai-lens-v3/inline_kit.py my-thing.html
```

It is idempotent, so changing the CSS once and re-running updates every artifact.

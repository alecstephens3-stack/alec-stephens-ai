"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Result =
  | { kind: "code"; code: string }
  | { kind: "denied" }
  | { kind: "error"; detail: string };

/** Reads Intuit's redirect once, then clears it from the address bar and history. */
function readRedirect(): Result {
  const q = new URLSearchParams(window.location.search);
  const error = q.get("error");
  if (error === "access_denied") return { kind: "denied" };
  if (error) return { kind: "error", detail: error };
  const code = q.get("code");
  const realm = q.get("realmId");
  const state = q.get("state");
  if (!code || !realm || !state) {
    return { kind: "error", detail: "no connection details in the link" };
  }
  return { kind: "code", code: `QBC:${realm}:${state}:${code}` };
}

/**
 * Client-only (loaded with ssr: false by ./loader), so the address bar can be read while the first
 * render happens instead of in an effect. The effect only clears the address afterwards; running it
 * twice (React does in development) is harmless because the code is already in state.
 */
export default function ConnectionCode() {
  const [result] = useState<Result>(readRedirect);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const box = document.getElementById("qb-code") as HTMLTextAreaElement | null;
      box?.select();
      document.execCommand("copy");
    }
    setCopied(true);
  }

  return (
    <section className="rounded-panel sai-pane px-7 py-9 md:px-10 md:py-11">
      <p className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-accent-deep">
        File Invoices · QuickBooks
      </p>

      {result.kind === "code" && (
        <>
          <h1 className="mt-3 font-heading text-[30px] font-medium leading-[1.1] tracking-[-0.02em] text-ink md:text-[38px]">
            Almost connected.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-2">
            Copy this code and paste it into File Invoices, in the box that
            says &ldquo;paste the connection code&rdquo;, then click{" "}
            <strong>Finish connecting</strong>. It only works for the next few
            minutes.
          </p>
          <textarea
            id="qb-code"
            readOnly
            value={result.code}
            rows={3}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-6 w-full resize-none rounded-lg border border-rule-soft bg-white/70 px-4 py-3 font-mono text-[15px] leading-snug text-ink"
            aria-label="Connection code"
          />
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Button type="button" onClick={() => copy(result.code)}>
              {copied ? "Copied" : "Copy the code"}
            </Button>
            {copied && (
              <span className="text-[15px] text-ink-2">
                Now paste it into File Invoices. You can close this tab after.
              </span>
            )}
          </div>
        </>
      )}

      {result.kind === "denied" && (
        <>
          <h1 className="mt-3 font-heading text-[30px] font-medium leading-[1.1] tracking-[-0.02em] text-ink md:text-[38px]">
            Not connected.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-2">
            QuickBooks was not connected because Allow was not clicked. Nothing
            changed. To try again, go back to File Invoices and click{" "}
            <strong>Connect QuickBooks</strong>.
          </p>
        </>
      )}

      {result.kind === "error" && (
        <>
          <h1 className="mt-3 font-heading text-[30px] font-medium leading-[1.1] tracking-[-0.02em] text-ink md:text-[38px]">
            Something went wrong.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-2">
            QuickBooks did not send a connection code ({result.detail}). Go
            back to File Invoices and click <strong>Connect QuickBooks</strong>{" "}
            again. If it happens twice, email{" "}
            <a className="underline underline-offset-4" href="mailto:alec@stephensai.co">
              alec@stephensai.co
            </a>
            .
          </p>
        </>
      )}
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/content";

/**
 * The launch and disconnect page for File Invoices' QuickBooks connection.
 * Intuit's app listing needs a public page that says what the app does with a
 * company's books and how to disconnect it; this is that page. The redirect
 * target itself is /qb/callback.
 */
export const metadata: Metadata = {
  title: "File Invoices and QuickBooks",
  description:
    "What Stephens AI's File Invoices app does in a practice's QuickBooks Online company, and how to disconnect it.",
  robots: { index: false, follow: false },
};

export default function QuickBooksInfo() {
  return (
    <div className="px-4 pb-16 pt-28 md:px-6 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-panel sai-pane px-7 py-9 md:px-10 md:py-11">
          <p className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-accent-deep">
            Stephens AI LLC
          </p>
          <h1 className="mt-3 font-heading text-[34px] font-medium leading-[1.08] tracking-[-0.025em] text-ink md:text-[44px]">
            File Invoices and QuickBooks
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-2">
            File Invoices is a program we build and run for the practices we
            work with. It reads the vendor invoices a practice scans in, files
            each one into the right vendor folder, and enters it in QuickBooks
            Online as an unpaid bill with the amount it read. It is not sold or
            listed publicly; it is set up for each practice by us.
          </p>
        </section>

        <section className="mt-4 rounded-panel sai-pane px-7 py-8 md:px-10">
          <h2 className="font-heading text-[22px] font-medium tracking-[-0.01em] text-ink">
            What it does in your QuickBooks company
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-ink-2">
            <li>Reads your vendor list and your expense accounts, so each bill goes to the right vendor and account.</li>
            <li>Creates one unpaid bill per approved invoice, and checks first that the same bill is not already there.</li>
            <li>Deletes a bill it created only when you click Undo in the program for that run, and never one with a payment against it.</li>
            <li>Never creates vendors or accounts, never records payments, and never uploads your documents to QuickBooks.</li>
          </ul>
          <p className="mt-4 text-base leading-relaxed text-ink-2">
            The connection is made by an admin of your QuickBooks company, who
            clicks Allow on Intuit&rsquo;s own sign-in page. The connection is
            stored only on the practice&rsquo;s computer, in the operating
            system&rsquo;s password vault.
          </p>
        </section>

        <section className="mt-4 rounded-panel sai-pane px-7 py-8 md:px-10">
          <h2 className="font-heading text-[22px] font-medium tracking-[-0.01em] text-ink">
            How to disconnect
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-2">
            In File Invoices, open <strong>Settings</strong>, then{" "}
            <strong>Disconnect</strong> under QuickBooks. Or, in QuickBooks, a
            company admin can remove the app from the list of connected apps.
            Either way, the program can no longer reach your books, and the
            bills it already entered stay where they are.
          </p>
        </section>

        <section className="mt-4 rounded-panel sai-pane px-7 py-8 md:px-10">
          <h2 className="font-heading text-[22px] font-medium tracking-[-0.01em] text-ink">
            Questions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-2">
            Email{" "}
            <a className="underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            . Our <Link className="underline underline-offset-4" href="/privacy">privacy policy</Link> and{" "}
            <Link className="underline underline-offset-4" href="/terms">terms</Link> apply.
          </p>
        </section>
      </div>
    </div>
  );
}

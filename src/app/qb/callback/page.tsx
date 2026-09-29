import type { Metadata } from "next";
import { ConnectionCodeLoader } from "./loader";

/**
 * Where Intuit sends the browser after a QuickBooks admin clicks Allow for
 * File Invoices (the WFV invoice runner, repo wfv-invoice-runner, filer/qbo.py).
 *
 * The app on the clinic PC cannot receive the redirect itself (Intuit rejects
 * localhost for production apps), so this page only shows what Intuit put in
 * the address bar as one line, `QBC:<realmId>:<state>:<code>`, for the person
 * to paste back into the app. No server work, nothing stored, nothing sent
 * anywhere: the code is single-use, expires in minutes, and is worthless
 * without the client secret that lives on the clinic PC.
 *
 * The redirect URI registered in the Intuit developer app must be exactly
 * https://stephensai.co/qb/callback (both development and production keys).
 */
export const metadata: Metadata = {
  title: "Connect QuickBooks",
  robots: { index: false, follow: false },
};

export default function QuickBooksCallback() {
  return (
    <div className="px-4 pb-16 pt-28 md:px-6 md:pt-32">
      <div className="mx-auto max-w-2xl">
        <ConnectionCodeLoader />
      </div>
    </div>
  );
}

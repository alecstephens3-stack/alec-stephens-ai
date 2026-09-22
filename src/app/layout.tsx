import type { Metadata } from "next";
import { Inter_Tight, Kalam, Reenie_Beanie, Schibsted_Grotesk } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Scene } from "@/components/ui/scene";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/content";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

/**
 * Kalam and Reenie Beanie are ONLY the two handwritings inside the lens hero
 * illustration (the office manager, and whoever took the phone message). They
 * are never page type. The hero reads the generated family names off these
 * variables, because next/font scopes them.
 */
const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const reenie = Reenie_Beanie({
  variable: "--font-reenie",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "clinic front desk knowledge base",
    "medical office custom software",
    "healthcare practice operations",
    "front desk SOP software",
    "independent clinic consulting",
    "office manager tools",
  ],
  authors: [{ name: "Alec Stephens" }, { name: "Jusheen Kim" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  // Draft deploys (DRAFT_NOINDEX=1) must never be indexed as a second copy of the site.
  robots: process.env.DRAFT_NOINDEX ? { index: false, follow: false } : { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} ${schibstedGrotesk.variable} ${kalam.variable} ${reenie.variable}`}>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to main content
        </a>
        <Scene />
        {/* The header sits OUTSIDE the content wrapper on purpose. Inside it,
            the wrapper's stacking context trapped the header's z-50 below the
            portaled mobile sheet (z-40 on body), so the hamburger and its
            close control painted underneath the overlay and could not be
            tapped. Out here the order is content (0) < sheet (40) < dock (50). */}
        <Header />
        <div className="relative isolate">
          <main id="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter_Tight, Schibsted_Grotesk } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Scene } from "@/components/ui/scene";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/content";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} | Front desk systems for independent eyecare`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "optometry front desk training",
    "eyecare practice knowledge base",
    "optometry practice operations",
    "front desk SOP software",
    "independent optometry consulting",
    "practice management training",
  ],
  authors: [{ name: "Alec Stephens" }, { name: "Jusheen Kim" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Front desk systems for independent eyecare`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Front desk systems for independent eyecare`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} ${schibstedGrotesk.variable}`}>
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

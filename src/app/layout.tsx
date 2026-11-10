import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { site } from "@/content/site";
import "./globals.css";

// Display serif for the hero headline and the closing call to action. Downloaded at
// build time and served from this site, so visitors make no request to Google.
const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const origin = new URL(site.url).origin;

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: site.seo.title,
  description: site.seo.description,
  applicationName: `${site.shortName} portfolio`,
  authors: [{ name: site.name, url: `${site.url}/` }],
  creator: site.name,
  keywords: [
    "Mohith T K",
    "Mohith Thuraiyur Kirubanandham",
    "MSc Data Science",
    "University of Surrey",
    "data science placement",
    "machine learning",
    "artificial intelligence",
    "data analyst",
  ],
  alternates: { canonical: `${site.url}/` },
  openGraph: {
    type: "profile",
    url: `${site.url}/`,
    siteName: `${site.shortName} portfolio`,
    title: site.seo.title,
    description: site.seo.description,
    locale: "en_GB",
    firstName: "Mohith",
    lastName: "Thuraiyur Kirubanandham",
    username: "Mohith-373",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0f" },
  ],
};

// Runs before paint. Theme: dark unless the visitor chose light (or "match device").
// Also marks the page as scripted (.js enables scroll reveals) and, on the first page
// view in a tab, turns on the opening loader (.intro).
const themeScript = `(function(){var h=document.documentElement,d=true;h.classList.add('js');try{var s=localStorage.getItem('theme');if(s==='light')d=false;else if(s==='system')d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(!sessionStorage.getItem('intro')){h.classList.add('intro');sessionStorage.setItem('intro','1');}}catch(e){}if(d)h.classList.add('dark');})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-fg focus:shadow"
        >
          Skip to content
        </a>
        {/* Opening loader: pure CSS, shown once per tab, removes itself (see .loader). */}
        <div className="loader" aria-hidden="true">
          <div className="flex flex-col items-center gap-6">
            <p className="loader-name eyebrow">{site.shortName}</p>
            <div className="loader-bar" />
          </div>
        </div>
        {children}
        <MotionRoot />
      </body>
    </html>
  );
}

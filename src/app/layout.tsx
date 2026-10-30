import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { site } from "@/content/site";
import "./globals.css";

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1217" },
  ],
};

// Runs before paint: apply the saved theme, or follow the device setting.
const themeScript = `(function(){var d=window.matchMedia('(prefers-color-scheme: dark)').matches;try{var s=localStorage.getItem('theme');if(s==='dark'||s==='light')d=s==='dark';}catch(e){}if(d)document.documentElement.classList.add('dark');})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
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
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/content/site";
import "./globals.css";

const pretendard = localFont({ src: "../fonts/PretendardVariable.woff2", variable: "--font-pretendard", weight: "100 900", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4173";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${SITE.shortName} ${SITE.nameKo}`, template: `%s | ${SITE.shortName}` },
  description: SITE.description,
  openGraph: { title: `${SITE.shortName} ${SITE.nameKo}`, description: SITE.slogan, type: "website", locale: "ko_KR" },
};

export const viewport: Viewport = { themeColor: "#05080d", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${plexMono.variable}`}>
      <body>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

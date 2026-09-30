import Link from "next/link";
import { SITE } from "@/content/site";
import { Wordmark } from "./Wordmark";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-ink-950/70 backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-ink-800 focus:px-3 focus:py-2">
        본문 바로가기
      </a>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" aria-label={`${SITE.shortName} ${SITE.nameKo} 홈`}><Wordmark /></Link>
        <nav aria-label="주 메뉴">
          <ul className="flex gap-4 text-sm text-muted md:gap-7">
            {SITE.nav.map((item) => (
              <li key={item.href} className={item.label === "About" || item.label === "Careers" ? "" : "hidden sm:block"}>
                <Link className="hover:text-fg" href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

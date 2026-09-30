import Link from "next/link";
import { SITE } from "@/content/site";
import { Wordmark } from "./Wordmark";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink-950/75 backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-ink-800 focus:px-3 focus:py-2">
        본문 바로가기
      </a>
      <div className="container-site flex h-14 items-center justify-between">
        <Link href="/" aria-label={`${SITE.shortName} ${SITE.nameKo} 홈`}><Wordmark /></Link>
        <nav aria-label="주 메뉴" className="hidden sm:block">
          <ul className="flex gap-7 text-sm text-fg/70">
            {SITE.nav.map((item) => (
              <li key={item.href}><Link className="transition-colors hover:text-fg" href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}

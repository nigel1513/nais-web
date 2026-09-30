import Link from "next/link";
import { SITE } from "@/content/site";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-line bg-ink-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div className="space-y-3">
          <Wordmark />
          <p className="text-sm text-muted">{SITE.nameEn}</p>
          <p className="text-sm text-muted">{SITE.affiliation}</p>
        </div>
        <ul className="space-y-2 text-sm">
          {SITE.nav.map((l) => (<li key={l.href}><Link className="text-muted hover:text-fg" href={l.href}>{l.label}</Link></li>))}
        </ul>
        <ul className="space-y-2 text-sm">
          {SITE.footerLinks.map((l) => (
            <li key={l.label}>
              {/* sitemap.xml 같은 파일은 라우트가 아니므로 Link 프리페치를 쓰지 않는다 */}
              {l.href.endsWith(".xml")
                ? <a className="text-muted hover:text-fg" href={l.href}>{l.label}</a>
                : <Link className="text-muted hover:text-fg" href={l.href}>{l.label}</Link>}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

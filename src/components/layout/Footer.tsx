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
          {SITE.footerLinks.map((l) => (<li key={l.label}><Link className="text-muted hover:text-fg" href={l.href}>{l.label}</Link></li>))}
        </ul>
      </div>
    </footer>
  );
}

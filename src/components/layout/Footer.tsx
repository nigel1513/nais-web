import { SmartLink } from "@/components/ui/SmartLink";
import { SITE } from "@/content/site";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-white/10 bg-ink-950">
      <div className="container-site py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="space-y-4">
            <Wordmark />
            <p className="max-w-xs text-sm leading-relaxed text-muted">{SITE.mission}.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {SITE.footerGroups.map((g) => (
              <div key={g.title}>
                <h2 className="text-[13px] font-semibold text-fg">{g.title}</h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {g.links.map((l) => (
                    <li key={l.label}><SmartLink className="text-muted transition-colors hover:text-fg" href={l.href}>{l.label}</SmartLink></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-[13px] text-muted md:flex-row md:items-center md:justify-between">
          <p>{SITE.affiliation} · {SITE.nameEn}</p>
          <ul className="flex gap-5">
            {SITE.legalLinks.map((l) => (
              <li key={l.label}>
                <SmartLink className="hover:text-fg" href={l.href}>{l.label}</SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

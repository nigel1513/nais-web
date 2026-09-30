import Link from "next/link";
import { HOME_SECTIONS, NEWS } from "@/content/home";
import { Section } from "./Section";

const fmt = (d: string) => d.replaceAll("-", ".");

export function News() {
  const s = HOME_SECTIONS[6];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}>
      <h3 data-reveal className="font-mono text-xs tracking-widest text-muted">Latest News</h3>
      <ul className="divide-y divide-line border-y border-line">
        {NEWS.map((n) => (
          <li data-reveal key={n.title} className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr]">
            <time dateTime={n.date} className="font-mono text-xs text-cyan">{fmt(n.date)}</time>
            <div>
              <p className="font-medium">{n.href ? <Link className="hover:underline" href={n.href}>{n.title}</Link> : n.title}</p>
              <p className="text-sm text-muted">{n.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      <Link data-reveal href="/careers/" className="inline-flex rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-cyan/90">
        Join NAIS →
      </Link>
    </Section>
  );
}

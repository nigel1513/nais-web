import { HOME_SECTIONS, ECOSYSTEM_BODY } from "@/content/home";
import { INSTITUTES } from "@/content/institutes";
import { Section } from "./Section";

export function Ecosystem() {
  const s = HOME_SECTIONS[5];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}>
      <p data-reveal className="text-fg/85">{ECOSYSTEM_BODY}</p>
      <p data-reveal className="font-mono text-xs tracking-widest text-muted">Science connects.</p>
      <ul data-reveal className="flex flex-wrap gap-1.5 font-mono text-[11px] text-muted" aria-label="연결 연구기관">
        {INSTITUTES.map((i) => (<li key={i.code} title={`${i.nameKo} · ${i.city}`} className="rounded border border-line px-1.5 py-0.5">{i.code}</li>))}
      </ul>
    </Section>
  );
}

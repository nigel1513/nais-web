import { HOME_SECTIONS, ECOSYSTEM_BODY } from "@/content/home";
import { INSTITUTES } from "@/content/institutes";
import { Marquee } from "@/components/ui/Marquee";
import { Section } from "./Section";

const names = INSTITUTES.map((i) => i.nameKo);
const half = Math.ceil(names.length / 2);

function InstituteMarquee() {
  return (
    <div className="relative z-10 -mx-4 space-y-2 pb-24 md:-mx-8">
      <Marquee items={names.slice(0, half)} />
      <Marquee items={names.slice(half)} reverse outline />
      <ul className="sr-only">{names.map((n) => <li key={n}>{n}</li>)}</ul>
    </div>
  );
}

export function Ecosystem() {
  const s = HOME_SECTIONS[5];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title} lead={ECOSYSTEM_BODY} after={<InstituteMarquee />}>
      <p data-reveal className="text-[1.35rem] font-medium leading-snug tracking-[-0.02em] text-fg/40">Science connects.</p>
    </Section>
  );
}

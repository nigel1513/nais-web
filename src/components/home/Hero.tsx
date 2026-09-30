import { HOME_SECTIONS, HERO_SUB } from "@/content/home";
import { SITE } from "@/content/site";
import { Section } from "./Section";

export function Hero() {
  const s = HOME_SECTIONS[0];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title} as="h1">
      <p data-reveal className="max-w-xl text-lg leading-relaxed text-fg/85">{HERO_SUB}</p>
      <p data-reveal className="text-sm text-muted">{SITE.vision}</p>
      <a data-reveal href="#platform" className="inline-flex items-center gap-2 font-mono text-sm text-cyan hover:underline">Explore NAIS ↓</a>
    </Section>
  );
}

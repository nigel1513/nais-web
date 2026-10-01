import { HOME_SECTIONS, HERO_SUB } from "@/content/home";
import { SITE } from "@/content/site";
import { TextLink } from "@/components/ui/TextLink";
import { Section } from "./Section";

export function Hero() {
  const s = HOME_SECTIONS[0];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title} lead={HERO_SUB} as="h1" reveal={false}>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <a href="#platform" className="inline-flex h-11 items-center rounded-full bg-fg px-6 text-[15px] font-semibold text-ink-950 press hover:bg-cyan">
          NAIS 둘러보기
        </a>
        <TextLink href="/about/">센터 소개</TextLink>
      </div>
      <p className="text-[1.35rem] font-medium leading-snug tracking-[-0.02em] text-fg/40">{SITE.vision}</p>
    </Section>
  );
}

import { HOME_SECTIONS, PLATFORM_CARDS } from "@/content/home";
import { Section, CardGrid } from "./Section";

export function Platform() {
  const s = HOME_SECTIONS[1];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}>
      <p data-reveal className="font-mono text-xs tracking-widest text-muted">What We Do</p>
      <p data-reveal className="text-fg/85">연구자가 사용하는 개별 AI 기술이 아니라, 과학 AI를 움직이게 하는 공통 기반을 만듭니다.</p>
      <CardGrid cards={PLATFORM_CARDS} />
    </Section>
  );
}

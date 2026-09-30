import { HOME_SECTIONS, CONVERGENCE_CARDS } from "@/content/home";
import { Section, CardGrid } from "./Section";

export function Convergence() {
  const s = HOME_SECTIONS[2];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}>
      <p data-reveal className="text-fg/85">Where domain knowledge meets AI. 각 분야의 전문성과 AI를 결합해 현장에서 검증합니다.</p>
      <CardGrid cards={CONVERGENCE_CARDS} />
    </Section>
  );
}

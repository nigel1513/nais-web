import { HOME_SECTIONS, AUTONOMOUS_BODY, LOOP_STAGES } from "@/content/home";
import { CycleWords } from "@/components/ui/CycleWords";
import { Section } from "./Section";

export function Autonomous() {
  const s = HOME_SECTIONS[3];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title} lead={AUTONOMOUS_BODY}>
      <div data-reveal>
        <CycleWords words={[...LOOP_STAGES]} label="연구 순환 단계" className="text-[2.6rem] font-bold leading-[1.15] tracking-[-0.03em] md:text-[3.4rem]" />
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-muted">Question → Search → Hypothesis → Experiment → Analysis → Learning ↺</p>
      </div>
    </Section>
  );
}

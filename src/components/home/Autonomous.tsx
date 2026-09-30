import { HOME_SECTIONS, AUTONOMOUS_BODY, LOOP_STAGES } from "@/content/home";
import { CycleWords } from "@/components/ui/CycleWords";
import { Section } from "./Section";

export function Autonomous() {
  const s = HOME_SECTIONS[3];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title} lead={AUTONOMOUS_BODY}>
      <div data-reveal>
        <CycleWords words={[...LOOP_STAGES]} label="Research loop" interval={1000}
          className="flex-col !items-start gap-y-0 text-[2.6rem] font-bold leading-[1.08] tracking-[-0.035em] md:text-[3.3rem]" />
      </div>
    </Section>
  );
}

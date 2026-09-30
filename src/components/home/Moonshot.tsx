import { HOME_SECTIONS, MOONSHOT_BODY, MISSIONS } from "@/content/home";
import { CycleWords } from "@/components/ui/CycleWords";
import { Section } from "./Section";

export function Moonshot() {
  const s = HOME_SECTIONS[4];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title} lead={MOONSHOT_BODY}>
      <div data-reveal>
        <CycleWords words={MISSIONS.map((m) => m.name)} interval={900} label="K-문샷 미션"
          className="text-[1.9rem] font-semibold leading-[1.25] tracking-[-0.025em] md:text-[2.3rem]" />
      </div>
    </Section>
  );
}

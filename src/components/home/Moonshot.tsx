import { HOME_SECTIONS, MOONSHOT_BODY, MISSIONS } from "@/content/home";
import { CycleWords } from "@/components/ui/CycleWords";
import { Section } from "./Section";

export function Moonshot() {
  const s = HOME_SECTIONS[4];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title} lead={MOONSHOT_BODY}>
      <div data-reveal>
        <p className="text-[13px] text-muted">12개 미션</p>
        <CycleWords words={MISSIONS.map((m) => m.name)} dimmed={["명칭 확인 중"]} interval={900} label="K-문샷 12개 미션"
          className="mt-3 text-[1.9rem] font-semibold leading-[1.25] tracking-[-0.025em] md:text-[2.3rem]" />
      </div>
    </Section>
  );
}

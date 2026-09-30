import { HOME_SECTIONS, SEED_FACTS, CONVERGENCE_ITEMS } from "@/content/home";
import { IndexedList } from "@/components/ui/IndexedList";
import { TextLink } from "@/components/ui/TextLink";
import { CountUp } from "@/components/ui/CountUp";
import { Section } from "./Section";

export function Convergence() {
  const s = HOME_SECTIONS[2];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}
      lead="각 분야의 전문성과 AI를 결합하고, 연구 현장에서 효과를 검증합니다.">
      <div data-reveal>
        <p className="text-[15px] font-medium text-cyan">모집 중 · 2026 AI 융합연구사업 Seed형</p>
        <dl className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
          {SEED_FACTS.map((f) => (
            <div key={f.label}>
              <dd className="text-[2.35rem] font-bold leading-none tracking-[-0.04em] tabular-nums sm:text-[3rem] md:text-[3.6rem]">
                {/^\d+$/.test(f.value) ? <CountUp value={Number(f.value)} /> : f.value}
                {f.unit && <span className="ml-1 text-sm font-medium tracking-normal text-fg/60 sm:text-base">{f.unit}</span>}
              </dd>
              <dt className="mt-2 text-[13px] text-muted">{f.label}</dt>
            </div>
          ))}
        </dl>
        <TextLink href="/programs/" className="mt-6">Seed형 공모 안내</TextLink>
      </div>
      <IndexedList items={CONVERGENCE_ITEMS} />
    </Section>
  );
}

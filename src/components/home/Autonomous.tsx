import { HOME_SECTIONS, AUTONOMOUS_POINTS, LOOP_STAGES } from "@/content/home";
import { Section, CardGrid } from "./Section";

export function Autonomous() {
  const s = HOME_SECTIONS[3];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}>
      <ol data-reveal className="flex flex-wrap gap-2 font-mono text-xs" aria-label="연구 순환 단계">
        {LOOP_STAGES.map((st, i) => (
          <li key={st} className="rounded-full border border-line px-3 py-1 text-muted">
            <span className="text-cyan">{String(i + 1).padStart(2, "0")}</span> {st}
          </li>
        ))}
      </ol>
      <CardGrid cards={AUTONOMOUS_POINTS} />
    </Section>
  );
}

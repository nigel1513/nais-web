import { HOME_SECTIONS, MOONSHOT_BODY, MISSIONS } from "@/content/home";
import { Section } from "./Section";

export function Moonshot() {
  const s = HOME_SECTIONS[4];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}>
      <p data-reveal className="text-fg/85">{MOONSHOT_BODY}</p>
      <ul data-reveal className="grid grid-cols-3 gap-2 font-mono text-xs sm:grid-cols-4" aria-label="K-문샷 12개 미션">
        {MISSIONS.map((m) => (<li key={m} className="rounded border border-line px-2 py-1.5 text-center text-muted">{m}</li>))}
      </ul>
      <p data-reveal className="text-xs text-muted">미션별 명칭은 공식 발표에 맞춰 공개됩니다.</p>
    </Section>
  );
}

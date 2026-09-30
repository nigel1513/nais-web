import { HOME_SECTIONS, NEWS, NEXT_STEPS } from "@/content/home";
import { TextLink } from "@/components/ui/TextLink";
import { SmartLink } from "@/components/ui/SmartLink";
import { Section } from "./Section";

const md = (d: string) => d.slice(5).replace("-", ".");

export function NextSteps() {
  return (
    <div id="next-steps" className="relative z-10 bg-ink-950 pb-28 pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      <div className="container-site">
      <p className="eyebrow">Next Steps</p>
      <div className="mt-8 grid gap-12 md:grid-cols-3">
        {NEXT_STEPS.map((n) => (
          <div key={n.title}>
            <h3 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.025em]">{n.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{n.body}</p>
            <TextLink href={n.href} className="mt-5">{n.link}</TextLink>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export function News() {
  const s = HOME_SECTIONS[6];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title}>
      <div data-reveal className="flex items-baseline justify-between">
        <h3 className="text-[13px] text-muted">최신 소식</h3>
        <TextLink href="/news/" className="text-sm">전체 보기</TextLink>
      </div>
      <div className="space-y-8">
        {NEWS.map((n) => (
          <article data-reveal key={n.title} className="group grid grid-cols-[5.5rem_1fr] gap-x-5">
            <div>
              <time dateTime={n.date} className="block font-mono text-[1.6rem] font-light leading-none tabular-nums text-fg/30 transition-colors group-hover:text-cyan">{md(n.date)}</time>
              <p className="mt-2 text-[13px] text-cyan">{n.category}</p>
            </div>
            <div>
              <h4 className="text-[1.2rem] font-semibold leading-snug tracking-[-0.02em]">
                <SmartLink href={n.href} className="transition-colors hover:text-cyan">{n.title}</SmartLink>
              </h4>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{n.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

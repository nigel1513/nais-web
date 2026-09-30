import type { Metadata } from "next";
import { PROGRAMS, programStatus } from "@/content/pages";
import { PageHero } from "@/components/page/PageHero";
import { SubNav } from "@/components/page/SubNav";
import { SmartLink } from "@/components/ui/SmartLink";

export const metadata: Metadata = { title: "사업", description: "NAIS AI 융합연구사업, AI 해커톤" };

const STATUS_STYLE: Record<string, string> = { "진행 중": "bg-cyan text-ink-950", "예정": "border border-cyan/60 text-cyan", "마감": "border border-white/20 text-muted" };

export default function ProgramsPage() {
  return (
    <>
      <PageHero eyebrow="Programs" title="사업" lead="출연연과 연구자가 과학 AI를 직접 만들고 검증할 수 있도록 연구비, 컴퓨팅 자원, 공동 모델을 지원합니다." />
      <SubNav label="사업 목록" items={PROGRAMS.map((p) => ({ label: p.title.replace("2026 NAIS ", ""), href: `#${p.id}` }))} />
      {PROGRAMS.map((p) => {
        const status = programStatus(p);
        return (
          <section key={p.id} id={p.id} aria-labelledby={`${p.id}-title`} className="container-site grid scroll-mt-32 gap-12 py-24 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${STATUS_STYLE[status]}`}>{status}</span>
                <span className="text-[13px] text-muted">{p.category}</span>
              </div>
              <h2 id={`${p.id}-title`} className="mt-5 text-[2rem] font-semibold leading-tight tracking-[-0.025em] md:text-[2.4rem]">{p.title}</h2>
              <p className="mt-5 text-[17px] leading-relaxed text-fg/75">{p.summary}</p>
              <p className="mt-6 font-mono text-[15px] tabular-nums text-cyan">{p.period.label}</p>
            </div>
            <div className="space-y-10 lg:col-span-6 lg:col-start-7">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-8">
                {p.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-[13px] text-muted">{f.label}</dt>
                    <dd className="mt-2 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="space-y-3 text-[16px] leading-relaxed text-fg/85">
                {p.details.map((d) => <li key={d} className="flex gap-3"><span aria-hidden="true" className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-cyan" />{d}</li>)}
              </ul>
              <SmartLink href={p.source.href} className="inline-block text-sm text-muted transition-colors hover:text-fg">출처: {p.source.label} ↗</SmartLink>
            </div>
          </section>
        );
      })}
    </>
  );
}

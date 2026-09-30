import type { Metadata } from "next";
import { RESEARCH, MOONSHOT_FIELDS } from "@/content/pages";
import { MISSIONS } from "@/content/home";
import { PageHero } from "@/components/page/PageHero";
import { SubNav } from "@/components/page/SubNav";
import { TextLink } from "@/components/ui/TextLink";

export const metadata: Metadata = { title: "연구", description: "과학AI 통합플랫폼, 과학AI 융합, 자율형 AI 과학자, K-문샷" };

export default function ResearchPage() {
  return (
    <>
      <PageHero eyebrow="Research" title="연구" lead="과학 AI의 공통 기반을 만들고, 연구 현장에 적용하고, 연구 방식 자체를 바꾸고, 국가 임무에 도전합니다." />
      <SubNav label="연구 분야" items={RESEARCH.map((r) => ({ label: r.title, href: `#${r.id}` }))} />
      {RESEARCH.map((r, idx) => (
        <section key={r.id} id={r.id} aria-labelledby={`${r.id}-title`} className="container-site grid scroll-mt-32 gap-12 py-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">{String(idx + 1).padStart(2, "0")} · {r.eyebrow}</p>
            <h2 id={`${r.id}-title`} className="mt-4 text-[2rem] font-semibold leading-tight tracking-[-0.025em] md:text-[2.6rem]">{r.title}</h2>
            <p className="mt-5 text-[17px] leading-relaxed text-fg/75">{r.lead}</p>
            <TextLink href={`/about/organization/#unit-${r.ownerId}`} className="mt-7">{r.owner}</TextLink>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            {r.id === "moonshot" ? (
              <div className="space-y-12">
                <div>
                  <h3 className="text-[13px] text-muted">8대 분야</h3>
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[1.35rem] font-semibold tracking-[-0.02em]">
                    {MOONSHOT_FIELDS.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[13px] text-muted">미션별 총괄지휘자(PD) 운영 미션</h3>
                  <ol className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
                    {MISSIONS.map((m) => (
                      <li key={m.code} className="flex items-baseline gap-3 text-[16px]">
                        <span className="font-mono text-xs tabular-nums text-muted">{m.code}</span>{m.name}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <ol className="space-y-6">
                {r.points.map((p, i) => (
                  <li key={p} className="grid grid-cols-[2.5rem_1fr] gap-3">
                    <span className="font-mono text-[1.3rem] font-light tabular-nums text-fg/25">{String(i + 1).padStart(2, "0")}</span>
                    <span className="pt-1 text-[16px] leading-relaxed text-fg/85">{p}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      ))}
    </>
  );
}

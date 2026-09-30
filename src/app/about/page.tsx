import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { ABOUT_FACTS, ABOUT_PURPOSE, HISTORY } from "@/content/pages";
import { PageHero } from "@/components/page/PageHero";
import { SubNav, ABOUT_NAV } from "@/components/page/SubNav";
import { SmartLink } from "@/components/ui/SmartLink";

export const metadata: Metadata = { title: "센터 소개", description: SITE.description };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About NAIS" title="센터 소개" lead={`${SITE.mission}.`} />
      <SubNav label="센터 소개 메뉴" items={ABOUT_NAV} current="/about/" />

      <section aria-labelledby="overview-title" className="container-site grid gap-12 py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">Overview</p>
          <h2 id="overview-title" className="mt-4 text-[2rem] font-semibold leading-tight tracking-[-0.025em] md:text-[2.6rem]">{SITE.slogan}</h2>
        </div>
        <div className="space-y-10 lg:col-span-7">
          <p className="text-[17px] leading-[1.85] text-fg/80">{ABOUT_PURPOSE}</p>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
            {ABOUT_FACTS.map((f) => (
              <div key={f.label}>
                <dt className="text-[13px] text-muted">{f.label}</dt>
                <dd className="mt-2 text-xl font-semibold tracking-[-0.02em]">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[1.35rem] font-medium leading-snug tracking-[-0.02em] text-fg/45">{SITE.vision}</p>
        </div>
      </section>

      <section id="history" aria-labelledby="history-title" className="container-site scroll-mt-32 py-24">
        <p className="eyebrow">History</p>
        <h2 id="history-title" className="mt-4 text-[2rem] font-semibold tracking-[-0.025em] md:text-[2.6rem]">연혁</h2>
        <ol className="mt-12 grid gap-x-10 gap-y-7 md:grid-cols-2">
          {HISTORY.map((h) => (
            <li key={h.date + h.text} className="grid grid-cols-[5.5rem_1fr] gap-4">
              <span className="font-mono text-[15px] tabular-nums text-cyan">{h.date}</span>
              <span className="text-[16px] leading-relaxed text-fg/85">{h.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="container-site scroll-mt-32 pb-32 pt-24">
        <p className="eyebrow">Contact</p>
        <h2 id="contact-title" className="mt-4 text-[2rem] font-semibold tracking-[-0.025em] md:text-[2.6rem]">문의</h2>
        <dl className="mt-10 grid gap-8 text-[16px] sm:grid-cols-3">
          <div><dt className="text-[13px] text-muted">담당</dt><dd className="mt-2 font-medium">{SITE.contact.name} 센터장</dd></div>
          <div><dt className="text-[13px] text-muted">이메일</dt><dd className="mt-2"><a href={`mailto:${SITE.contact.email}`} className="font-medium underline decoration-white/25 underline-offset-4 hover:decoration-cyan">{SITE.contact.email}</a></dd></div>
          <div><dt className="text-[13px] text-muted">소속</dt><dd className="mt-2"><SmartLink href={SITE.familySites[0].href} className="font-medium hover:text-cyan">국가과학기술연구회 ↗</SmartLink></dd></div>
        </dl>
      </section>
    </>
  );
}

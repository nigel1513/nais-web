import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { ABOUT_FACTS, ABOUT_PURPOSE } from "@/content/pages";
import { PageHero } from "@/components/page/PageHero";
import { SubNav, ABOUT_NAV } from "@/components/page/SubNav";

export const metadata: Metadata = { title: "센터 소개", description: SITE.description };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About NAIS" title="센터 소개" lead={`${SITE.mission}.`} />
      <SubNav label="센터 소개 메뉴" items={ABOUT_NAV} current="/about/" />
      <section aria-labelledby="overview-title" className="container-site grid gap-12 pb-32 pt-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">Overview</p>
          <h2 id="overview-title" className="mt-4 text-[2rem] font-semibold leading-tight tracking-[-0.025em] md:text-[2.6rem]">{SITE.slogan}</h2>
        </div>
        <div className="space-y-10 lg:col-span-7">
          <p className="text-[17px] leading-[1.85] text-fg/80">{ABOUT_PURPOSE}</p>
          {/* 칸 폭을 고정하지 않고 값 길이만큼 쓴다. 값은 줄바꿈하지 않고, 자리가 모자라면 항목째 다음 줄로 넘어간다 */}
          <dl className="grid grid-cols-[auto_auto] justify-start gap-x-12 gap-y-8 sm:flex sm:flex-wrap">
            {ABOUT_FACTS.map((f) => (
              <div key={f.label}>
                <dt className="text-[13px] text-muted">{f.label}</dt>
                <dd className="mt-2 whitespace-nowrap text-xl font-semibold tracking-[-0.02em]">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[1.35rem] font-medium leading-snug tracking-[-0.02em] text-fg/45">{SITE.vision}</p>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { HISTORY } from "@/content/pages";
import { PageHero } from "@/components/page/PageHero";
import { SubNav, ABOUT_NAV } from "@/components/page/SubNav";

export const metadata: Metadata = { title: "연혁", description: "국가과학AI연구센터 연혁" };

export default function HistoryPage() {
  return (
    <>
      <PageHero eyebrow="History" title="연혁" lead="과학 AI 국가전략 속에서 국가과학AI연구센터가 만들어진 과정입니다." />
      <SubNav label="센터 소개 메뉴" items={ABOUT_NAV} current="/about/history/" />
      <section aria-label="연혁" className="container-site pb-32 pt-24">
        <ol className="max-w-3xl space-y-9">
          {HISTORY.map((h) => (
            <li key={h.date + h.text} className="grid grid-cols-[6.5rem_1fr] gap-6">
              <span className="font-mono text-[1.25rem] font-light tabular-nums text-cyan">{h.date}</span>
              <span className="pt-0.5 text-[17px] leading-relaxed text-fg/85">{h.text}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { OrgChart } from "@/components/about/OrgChart";
import { StaffTables } from "@/components/about/StaffTables";

export const metadata: Metadata = { title: "조직도", description: "국가과학AI연구센터 조직도와 부서별 담당업무" };

export default function AboutPage() {
  return (
    <div className="px-4 md:px-8">
      <section id="organization" aria-labelledby="organization-title" className="mx-auto max-w-7xl scroll-mt-20 pb-24 pt-36">
        <p className="eyebrow">Organization</p>
        <h1 id="organization-title" className="mt-5 text-[2.8rem] font-bold leading-none tracking-[-0.035em] md:text-[5rem]">조직도</h1>
        <div className="mt-16">
          <OrgChart />
        </div>
      </section>
      <div className="mx-auto max-w-5xl pb-32">
        <h2 className="text-[13px] text-muted">부서별 담당업무</h2>
        <div className="mt-8">
          <StaffTables />
        </div>
        <p className="mt-16 text-xs text-muted">출처: 국가과학기술연구회 조직도 (2026년 9월 기준)</p>
      </div>
    </div>
  );
}

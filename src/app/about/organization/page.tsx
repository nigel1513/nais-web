import type { Metadata } from "next";
import { OrgChart } from "@/components/about/OrgChart";
import { PageHero } from "@/components/page/PageHero";
import { SubNav, ABOUT_NAV } from "@/components/page/SubNav";

export const metadata: Metadata = { title: "조직도", description: "국가과학AI연구센터 조직도와 부서별 담당업무" };

export default function OrganizationPage() {
  return (
    <>
      <PageHero eyebrow="Organization" title="조직도" lead="부서를 선택하면 직위별 담당업무를 볼 수 있습니다." />
      <SubNav label="센터 소개 메뉴" items={ABOUT_NAV} current="/about/organization/" />
      <section id="organization" aria-label="조직도" className="container-site scroll-mt-32 pb-32 pt-20">
        <OrgChart />
      </section>
    </>
  );
}

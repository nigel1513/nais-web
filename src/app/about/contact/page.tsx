import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { PageHero } from "@/components/page/PageHero";
import { SubNav, ABOUT_NAV } from "@/components/page/SubNav";
import { SmartLink } from "@/components/ui/SmartLink";

export const metadata: Metadata = { title: "문의", description: "국가과학AI연구센터 문의처" };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="문의" lead="국가과학AI연구센터 사업과 협력에 관한 문의를 받습니다." />
      <SubNav label="센터 소개 메뉴" items={ABOUT_NAV} current="/about/contact/" />
      <section aria-label="문의처" className="container-site pb-32 pt-24">
        <dl className="grid max-w-4xl gap-10 text-[17px] sm:grid-cols-3">
          <div><dt className="text-[13px] text-muted">담당</dt><dd className="mt-2 font-medium">{SITE.contact.name} 센터장</dd></div>
          <div><dt className="text-[13px] text-muted">이메일</dt><dd className="mt-2"><a href={`mailto:${SITE.contact.email}`} className="font-medium underline decoration-white/25 underline-offset-4 hover:decoration-cyan">{SITE.contact.email}</a></dd></div>
          <div><dt className="text-[13px] text-muted">소속</dt><dd className="mt-2"><SmartLink href={SITE.familySites[0].href} className="font-medium hover:text-cyan">국가과학기술연구회 ↗</SmartLink></dd></div>
        </dl>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { ARTICLES } from "@/content/pages";
import { PageHero } from "@/components/page/PageHero";
import { NewsList } from "@/components/page/NewsList";

export const metadata: Metadata = { title: "소식", description: "국가과학AI연구센터 공모·행사·채용 소식" };

export default function NewsPage() {
  return (
    <>
      <PageHero eyebrow="News" title="소식" lead="국가과학AI연구센터의 공모, 행사, 채용 소식을 전합니다." />
      <section className="container-site pb-32 pt-6"><NewsList articles={ARTICLES} /></section>
    </>
  );
}

import { SplitWords } from "@/components/ui/SplitWords";
import { Scramble } from "@/components/ui/Scramble";

/** 하위 페이지 공통 머리: 영문 라벨 · 큰 제목 · 한 줄 설명. 홈 첫 화면과 같은 방식으로 등장한다. */
export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <section className="container-site pb-14 pt-36">
      <p className="eyebrow"><Scramble text={eyebrow} /></p>
      <h1 className="hero-words mt-5 text-[2.8rem] font-bold leading-none tracking-[-0.035em] md:text-[4.5rem]"><SplitWords text={title} /></h1>
      {lead && <p className="hero-lead mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{lead}</p>}
    </section>
  );
}

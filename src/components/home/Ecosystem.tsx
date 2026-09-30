import Image from "next/image";
import { HOME_SECTIONS, ECOSYSTEM_BODY } from "@/content/home";
import { INSTITUTES } from "@/content/institutes";
import { ciSize } from "@/lib/ci";
import { Section } from "./Section";

/** 소관 연구기관 CI 목록. 파티클이 비치지 않도록 불투명한 띠 위에 둔다. */
function InstituteLogos() {
  return (
    <div id="institutes" className="relative z-10 bg-ink-950 pb-24 pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      <div className="container-site">
        <p className="eyebrow">Research Institutes</p>
        <h2 className="mt-4 text-[2rem] font-semibold tracking-[-0.025em] md:text-[2.6rem]">소관 연구기관</h2>
        <p className="mt-3 text-[15px] text-muted">국가과학기술연구회 소관 25개 과학기술분야 정부출연연구기관</p>
        <ul className="mt-12 grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {INSTITUTES.map((i) => {
            const size = ciSize(i.ci.width, i.ci.height);
            return (
              <li key={i.code} className="flex h-16 items-center">
                <Image src={`/ci/${i.code}.png`} alt={i.nameKo} title={i.nameKo} width={i.ci.width} height={i.ci.height}
                  style={{ width: size.width, height: size.height }}
                  className="max-w-full object-contain opacity-60 transition-opacity duration-300 hover:opacity-100" />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function Ecosystem() {
  const s = HOME_SECTIONS[5];
  return (
    <Section id={s.id} eyebrow={s.eyebrow} title={s.title} lead={ECOSYSTEM_BODY} after={<InstituteLogos />}>
      <p data-reveal className="text-[1.35rem] font-medium leading-snug tracking-[-0.02em] text-fg/40">Science connects.</p>
    </Section>
  );
}

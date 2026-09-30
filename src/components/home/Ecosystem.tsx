import Image from "next/image";
import { HOME_SECTIONS, ECOSYSTEM_BODY } from "@/content/home";
import { INSTITUTES } from "@/content/institutes";
import { Section } from "./Section";

/** 소관 연구기관 CI 목록. 파티클이 비치지 않도록 불투명한 띠 위에 둔다. */
function InstituteLogos() {
  return (
    <div id="institutes" className="relative z-10 -mx-4 bg-ink-950 px-4 pb-24 pt-16 md:-mx-8 md:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      <div className="mx-auto max-w-7xl">
        <h3 className="text-[13px] text-muted">국가과학기술연구회 소관 연구기관</h3>
        <ul className="mt-10 grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {INSTITUTES.map((i) => (
            <li key={i.code} className="flex h-12 items-center">
              <Image src={`/ci/${i.code}.png`} alt={i.nameKo} title={i.nameKo} width={180} height={48}
                className="h-auto max-h-11 w-auto max-w-[150px] object-contain opacity-60 transition-opacity duration-300 hover:opacity-100" />
            </li>
          ))}
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

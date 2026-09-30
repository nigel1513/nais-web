import { SplitWords } from "@/components/ui/SplitWords";
import { Scramble } from "@/components/ui/Scramble";
import { Reveal } from "./Reveal";

export function Section({ id, eyebrow, title, lead, as = "h2", reveal = true, children, after }: {
  id: string; eyebrow: string; title: string; lead?: string; as?: "h1" | "h2"; reveal?: boolean;
  children?: React.ReactNode; after?: React.ReactNode;
}) {
  const H = as;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative z-10">
      <Reveal enabled={reveal} className="container-site grid min-h-[140vh] items-center py-28 lg:grid-cols-12">
        <div className="relative min-w-0 lg:col-span-6 xl:col-span-5">
          <div aria-hidden="true" className="absolute -inset-x-4 -inset-y-12 -z-10 bg-[radial-gradient(ellipse_at_30%_50%,rgba(5,8,13,0.92),rgba(5,8,13,0.75)_55%,transparent_80%)] md:-inset-x-10" />
          <p className="eyebrow"><Scramble text={eyebrow} /></p>
          <H id={`${id}-title`} className={`${H === "h1"
            ? "hero-words mt-5 text-[2.8rem] font-bold leading-[1.08] tracking-[-0.035em] md:text-[4.4rem]"
            : "mt-4 text-[2.2rem] font-semibold leading-[1.15] tracking-[-0.03em] md:text-[3.1rem]"}`}>
            <SplitWords text={title} />
          </H>
          {lead && <p data-reveal className="mt-6 max-w-xl text-[17px] leading-relaxed text-fg/75">{lead}</p>}
          <div className="mt-10 space-y-10">{children}</div>
        </div>
      </Reveal>
      {after}
    </section>
  );
}

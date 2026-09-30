import { Reveal } from "./Reveal";

export function Section({ id, eyebrow, title, as = "h2", reveal = true, children }: {
  id: string; eyebrow: string; title: string; as?: "h1" | "h2"; reveal?: boolean; children?: React.ReactNode;
}) {
  const H = as;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative z-10 min-h-[140vh] px-4 md:px-8">
      <Reveal enabled={reveal} className="mx-auto grid min-h-screen max-w-7xl items-center py-28 lg:grid-cols-12">
        <div className="relative lg:col-span-6 xl:col-span-5">
          <div aria-hidden="true" className="absolute -inset-x-4 -inset-y-10 md:-inset-x-8 -z-10 rounded-[40px] bg-gradient-to-r from-ink-950/90 via-ink-950/70 to-transparent blur-2xl" />
          <p data-reveal className="eyebrow">{eyebrow}</p>
          <H data-reveal id={`${id}-title`} className={H === "h1" ? "mt-5 text-4xl font-bold leading-tight md:text-6xl" : "mt-4 text-3xl font-semibold leading-snug md:text-[2.6rem]"}>
            {title}
          </H>
          <div className="mt-8 space-y-6">{children}</div>
        </div>
      </Reveal>
    </section>
  );
}

export function CardGrid({ cards }: { cards: { label: string; title: string; body: string; status?: "planned" }[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {cards.map((c) => (
        <li data-reveal key={c.label} className="rounded-lg border border-line bg-ink-900/80 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] tracking-widest text-cyan">{c.label}</span>
            {c.status === "planned" && <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">준비 중</span>}
          </div>
          <h3 className="mt-2 font-semibold">{c.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}

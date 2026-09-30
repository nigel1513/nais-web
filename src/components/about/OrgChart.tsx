import { ORG, type OrgUnit } from "@/content/organization";

type Level = 0 | 1 | 2 | 3;
const SIZE: Record<Level, string> = {
  0: "text-3xl font-bold tracking-[-0.03em] md:text-[2.5rem]",
  1: "text-xl font-semibold tracking-[-0.02em] md:text-[1.4rem]",
  2: "text-[17px] font-medium md:text-lg",
  3: "text-[15px] md:text-base",
};

/** 구성원이 공개된 단위는 표로 이동하는 링크, 아니면 텍스트로 보여 준다. 연결선은 모두 점의 x좌표(3px)에 맞춘다. */
function Node({ unit, level }: { unit: OrgUnit; level: Level }) {
  const dot = <span aria-hidden="true" className={`shrink-0 rounded-full ${level === 0 ? "h-2.5 w-2.5 bg-cyan shadow-[0_0_14px_rgba(63,208,212,0.9)]" : "h-[7px] w-[7px] bg-cyan/80"}`} />;
  if (unit.staff.length > 0) {
    return (
      <a href={`#unit-${unit.id}`} className="group inline-flex items-center gap-3 py-1 transition-colors hover:text-cyan">
        {dot}<span className={SIZE[level]}>{unit.name}</span>
        <span aria-hidden="true" className="translate-x-[-4px] text-cyan opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">→</span>
      </a>
    );
  }
  const leaf = unit.children.length === 0;
  return (
    <span className={`inline-flex items-center gap-3 py-1 ${leaf ? "text-fg/55" : ""}`}>
      <span aria-hidden="true" className={`h-[7px] w-[7px] shrink-0 rounded-full ${leaf ? "border border-white/35" : "bg-cyan/80"}`} />
      <span className={SIZE[level]}>{unit.name}</span>
      {leaf && <span className="text-xs text-muted">구성 중</span>}
    </span>
  );
}

function Branch({ unit, level }: { unit: OrgUnit; level: 1 | 2 | 3 }) {
  return (
    <li className="relative">
      {level > 1 && <span aria-hidden="true" className="absolute -left-6 top-[1.15rem] h-px w-5 bg-white/15" />}
      <Node unit={unit} level={level} />
      {unit.children.length > 0 && (
        <ul className="ml-[3px] mt-1.5 space-y-1.5 border-l border-white/15 pl-6">
          {unit.children.map((c) => <Branch key={c.id} unit={c} level={(level + 1) as 2 | 3} />)}
        </ul>
      )}
    </li>
  );
}

export function OrgChart() {
  return (
    <div>
      <Node unit={ORG} level={0} />
      <span aria-hidden="true" className="ml-1 block h-8 w-px bg-white/15" />
      <ul className="grid gap-10 border-l border-white/15 pl-6 lg:grid-cols-4 lg:gap-8 lg:border-l-0 lg:pl-0">
        {ORG.children.map((b, i) => (
          <li key={b.id} className="relative lg:pt-7">
            <span aria-hidden="true" className="absolute -left-6 top-[1.2rem] h-px w-5 bg-white/15 lg:hidden" />
            {i < ORG.children.length - 1 && <span aria-hidden="true" className="absolute left-1 top-0 hidden h-px w-[calc(100%+2rem)] bg-white/15 lg:block" />}
            <span aria-hidden="true" className="absolute left-1 top-0 hidden h-7 w-px bg-white/15 lg:block" />
            <ul><Branch unit={b} level={1} /></ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

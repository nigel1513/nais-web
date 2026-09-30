"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ORG, flattenOrg, type OrgUnit } from "@/content/organization";
import { StaffTable } from "./StaffTable";

type Level = 0 | 1 | 2 | 3;
const ALL = flattenOrg(ORG);
const SIZE: Record<Level, string> = {
  0: "text-3xl font-bold tracking-[-0.03em] md:text-[2.5rem]",
  1: "text-xl font-semibold tracking-[-0.02em] md:text-[1.4rem]",
  2: "text-[17px] font-medium md:text-lg",
  3: "text-[15px] md:text-base",
};
const idFromHash = () => {
  const m = window.location.hash.match(/^#unit-(.+)$/);
  return m && ALL.some((u) => u.id === m[1]) ? m[1] : null;
};

function Node({ unit, level, selected, onSelect }: { unit: OrgUnit; level: Level; selected: string | null; onSelect: (id: string) => void }) {
  const active = selected === unit.id;
  const empty = unit.staff.length === 0 && unit.children.length === 0;
  return (
    <button type="button" aria-expanded={active} aria-controls="unit-panel" onClick={() => onSelect(unit.id)}
      className={`group inline-flex items-center gap-3 py-1 text-left transition-colors ${active ? "text-cyan" : empty ? "text-fg/55 hover:text-fg" : "hover:text-cyan"}`}>
      <span aria-hidden="true" className={`shrink-0 rounded-full transition-all ${level === 0 ? "h-2.5 w-2.5" : "h-[7px] w-[7px]"} ${active
        ? "bg-cyan shadow-[0_0_14px_rgba(63,208,212,0.9)]" : empty ? "border border-white/35" : "bg-cyan/80"}`} />
      <span className={SIZE[level]}>{unit.name}</span>
    </button>
  );
}

function Branch({ unit, level, selected, onSelect }: { unit: OrgUnit; level: 1 | 2 | 3; selected: string | null; onSelect: (id: string) => void }) {
  return (
    <li className="relative">
      {level > 1 && <span aria-hidden="true" className="absolute -left-6 top-[1.15rem] h-px w-5 bg-white/15" />}
      <Node unit={unit} level={level} selected={selected} onSelect={onSelect} />
      {unit.children.length > 0 && (
        <ul className="ml-[3px] mt-1.5 space-y-1.5 border-l border-white/15 pl-6">
          {unit.children.map((c) => <Branch key={c.id} unit={c} level={(level + 1) as 2 | 3} selected={selected} onSelect={onSelect} />)}
        </ul>
      )}
    </li>
  );
}

/** 조직도만 보여 주다가, 부서를 누르면 아래에 그 부서의 직위·담당업무·전화 표를 연다. 주소(#unit-id)와 동기화된다. */
export function OrgChart() {
  const [selected, setSelected] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setSelected(idFromHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (selected) panel.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }, [selected]);

  const select = useCallback((id: string) => {
    history.replaceState(null, "", `#unit-${id}`);
    setSelected(id);
  }, []);
  const close = useCallback(() => {
    history.replaceState(null, "", window.location.pathname);
    setSelected(null);
  }, []);

  const unit = selected ? ALL.find((u) => u.id === selected) : undefined;
  const parent = unit && ALL.find((p) => p.children.some((c) => c.id === unit.id));

  return (
    <div>
      <Node unit={ORG} level={0} selected={selected} onSelect={select} />
      <span aria-hidden="true" className="ml-1 block h-8 w-px bg-white/15" />
      <ul className="grid gap-10 border-l border-white/15 pl-6 lg:grid-cols-4 lg:gap-8 lg:border-l-0 lg:pl-0">
        {ORG.children.map((b, i) => (
          <li key={b.id} className="relative lg:pt-7">
            <span aria-hidden="true" className="absolute -left-6 top-[1.2rem] h-px w-5 bg-white/15 lg:hidden" />
            {i < ORG.children.length - 1 && <span aria-hidden="true" className="absolute left-1 top-0 hidden h-px w-[calc(100%+2rem)] bg-white/15 lg:block" />}
            <span aria-hidden="true" className="absolute left-1 top-0 hidden h-7 w-px bg-white/15 lg:block" />
            <ul><Branch unit={b} level={1} selected={selected} onSelect={select} /></ul>
          </li>
        ))}
      </ul>

      <div id="unit-panel" ref={panel} aria-live="polite" className="scroll-mt-24">
        {unit && (
          <section aria-labelledby="unit-panel-title" className="mt-20">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan">{unit.nameEn}</p>
                <h2 id="unit-panel-title" className="mt-2 text-[2rem] font-semibold tracking-[-0.025em] md:text-[2.4rem]">{unit.name}</h2>
                {parent && <p className="mt-1 text-sm text-muted">{parent.name}</p>}
              </div>
              <button type="button" onClick={close} className="shrink-0 rounded-full px-4 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-fg">닫기</button>
            </div>
            <div className="mt-8">
              {unit.staff.length > 0
                ? <StaffTable rows={unit.staff} />
                : <p className="text-[15px] text-muted">
                    구성원 정보가 아직 공개되지 않았습니다.
                    {unit.children.length > 0 && ` 하위 조직: ${unit.children.map((c) => c.name).join(", ")}`}
                  </p>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

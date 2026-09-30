"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ORG, flattenOrg, type OrgUnit } from "@/content/organization";
import { StaffTable } from "./StaffTable";

type Level = 0 | 1 | 2 | 3;
const ALL = flattenOrg(ORG);
const idFromHash = () => {
  const m = window.location.hash.match(/^#unit-(.+)$/);
  return m && ALL.some((u) => u.id === m[1]) ? m[1] : null;
};

const NODE: Record<Level, string> = {
  0: "min-w-[15rem] bg-cyan px-7 py-3.5 text-lg font-bold text-ink-950 hover:bg-cyan/90",
  1: "w-full max-w-[14rem] border border-cyan/50 bg-ink-900 px-4 py-3 text-[15px] font-semibold hover:border-cyan",
  2: "w-full max-w-[13rem] border border-white/20 bg-ink-900/80 px-3.5 py-2.5 text-[14px] font-medium hover:border-cyan/60",
  3: "w-full max-w-[12rem] border border-white/10 px-3 py-2 text-[13.5px] text-fg/80 hover:border-cyan/50 hover:text-fg",
};

function Node({ unit, level, selected, onSelect }: { unit: OrgUnit; level: Level; selected: string | null; onSelect: (id: string) => void }) {
  const active = selected === unit.id;
  const empty = unit.staff.length === 0 && unit.children.length === 0;
  return (
    <button type="button" aria-expanded={active} aria-controls="unit-panel" onClick={() => onSelect(unit.id)}
      className={`relative rounded-lg text-center leading-snug transition-colors ${NODE[level]} ${empty ? "text-fg/50" : ""} ${active ? "ring-2 ring-cyan ring-offset-2 ring-offset-ink-950" : ""}`}>
      {unit.name}
    </button>
  );
}

const V = ({ h = "h-5" }: { h?: string }) => <span aria-hidden="true" className={`block w-px ${h} bg-white/20`} />;

/** 한 부서와 그 아래 조직을 세로로, 가운데 정렬로 잇는다 */
function Column({ unit, level, selected, onSelect }: { unit: OrgUnit; level: 1 | 2 | 3; selected: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="flex w-full flex-col items-center">
      <Node unit={unit} level={level} selected={selected} onSelect={onSelect} />
      {unit.children.map((c) => (
        <div key={c.id} className="flex w-full flex-col items-center">
          <V />
          <Column unit={c} level={(level + 1) as 2 | 3} selected={selected} onSelect={onSelect} />
        </div>
      ))}
    </div>
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
      {/* 위에서 아래로 뻗는 중앙 정렬 조직도: 센터 → 4개 직속 조직 → 하위 조직 */}
      <div className="flex flex-col items-center">
        <Node unit={ORG} level={0} selected={selected} onSelect={select} />
        <V h="h-8" />
      </div>
      <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-0">
        <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-0 hidden h-px bg-white/20 lg:block" />
        {ORG.children.map((b) => (
          <div key={b.id} className="flex flex-col items-center lg:px-3">
            <span aria-hidden="true" className="hidden lg:block"><V h="h-8" /></span>
            <Column unit={b} level={1} selected={selected} onSelect={select} />
          </div>
        ))}
      </div>

      <div id="unit-panel" ref={panel} aria-live="polite" className="scroll-mt-40">
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
                : unit.children.length > 0 && (
                    <p className="text-[15px] text-fg/80">
                      <span className="mr-3 text-[13px] text-muted">하위 조직</span>{unit.children.map((c) => c.name).join(" · ")}
                    </p>
                  )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

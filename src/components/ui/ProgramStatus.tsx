"use client";
import { useEffect, useState } from "react";
import { PROGRAMS, programStatus, type ProgramState } from "@/content/pages";

const BADGE: Record<ProgramState, string> = {
  "진행 중": "bg-cyan text-ink-950",
  "예정": "border border-cyan/60 text-cyan",
  "마감": "border border-white/20 text-muted",
};
const LABEL: Record<ProgramState, string> = { "예정": "모집 예정", "진행 중": "모집 중", "마감": "모집 마감" };

/**
 * 사업 상태를 보는 사람의 현재 시각으로 계산한다(정적 빌드 시점이 아니라).
 * 빌드 때 계산한 값(initial)으로 먼저 그린 뒤, 브라우저에서 바로 다시 계산하고 1분마다 갱신한다.
 */
export function ProgramStatus({ id, initial, variant = "badge" }: { id: string; initial: ProgramState; variant?: "badge" | "label" }) {
  const program = PROGRAMS.find((p) => p.id === id)!;
  const [status, setStatus] = useState<ProgramState>(initial);
  useEffect(() => {
    const update = () => setStatus(programStatus(program, new Date()));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [program]);
  if (variant === "label") return <span data-status>{LABEL[status]}</span>;
  return <span data-status className={`rounded-full px-3 py-1 text-[12px] font-semibold ${BADGE[status]}`}>{status}</span>;
}

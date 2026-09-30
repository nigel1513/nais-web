"use client";
import { useEffect, useState } from "react";

/** 큰 단어들을 나열하고, 하나씩 차례로 강조한다(연구 순환·미션 목록). */
export function CycleWords({ words, interval = 1100, className = "", label, dimmed = [] }: {
  words: string[]; interval?: number; className?: string; label: string; dimmed?: string[];
}) {
  const [active, setActive] = useState(-1);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);
  return (
    <ol aria-label={label} className={`flex flex-wrap items-baseline gap-x-[0.45em] gap-y-1 ${className}`}>
      {words.map((w, i) => (
        <li key={w + i} className={`transition-colors duration-500 ${dimmed.includes(w) ? "text-fg/25" : i === active ? "text-cyan" : active === -1 ? "text-fg" : "text-fg/35"}`}>
          {w}
        </li>
      ))}
    </ol>
  );
}

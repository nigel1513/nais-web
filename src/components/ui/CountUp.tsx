"use client";
import { useEffect, useRef } from "react";

/** 화면에 들어오면 0에서 목표값까지 올라간다. 서버 렌더·JS 없음·reduced-motion에서는 목표값을 그대로 보여 준다. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return; // 이미 보이는 값은 건드리지 않는다
    let raf = 0;
    el.textContent = "0";
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now(), dur = 1200;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        el.textContent = String(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { rootMargin: "0px 0px -20% 0px" });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); el.textContent = String(value); };
  }, [value]);
  return <span ref={ref} data-countup className={className}>{value}</span>;
}

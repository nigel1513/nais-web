"use client";
import { useEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/";

/** 화면에 들어올 때 글자가 무작위 기호에서 원래 글자로 해독되듯 바뀐다. 서버 렌더와 reduced-motion에서는 원문 그대로다. */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const run = () => {
      const start = performance.now(), dur = 700;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const settled = Math.floor(p * text.length);
        el.textContent = text.split("").map((c, i) => (i < settled || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
        if (p < 1) raf = requestAnimationFrame(tick); else el.textContent = text;
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { rootMargin: "0px 0px -15% 0px" });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); el.textContent = text; };
  }, [text]);
  return <span ref={ref} aria-label={text} className={className}>{text}</span>;
}

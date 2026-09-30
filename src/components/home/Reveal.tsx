"use client";
import { useEffect, useRef } from "react";

/** 자식의 [data-reveal] 요소를 아래에서 올라오며 나타나게 한다. JS가 없거나 reduced-motion이면 처음부터 보인다. */
export function Reveal({ children, className, enabled = true }: { children: React.ReactNode; className?: string; enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const rect = root.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.75) return; // 이미 화면에 들어온 섹션은 그대로 둔다
    items.forEach((el, i) => { el.classList.add("reveal-pending"); el.style.transitionDelay = `${i * 80}ms`; });
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      items.forEach((el) => el.classList.remove("reveal-pending"));
      io.disconnect();
    }, { rootMargin: "0px 0px -25% 0px" });
    io.observe(root);
    return () => io.disconnect();
  }, [enabled]);
  return <div ref={ref} className={className}>{children}</div>;
}

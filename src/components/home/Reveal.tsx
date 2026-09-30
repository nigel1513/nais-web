"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** 자식의 [data-reveal] 요소를 아래에서 올라오며 나타나게 한다. JS가 없거나 reduced-motion이면 처음부터 보인다. */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(ref.current!.querySelectorAll("[data-reveal]"), {
      y: 28, opacity: 0, duration: 0.9, ease: "power2.out", stagger: 0.08,
      scrollTrigger: { trigger: ref.current, start: "top 75%" },
    });
  }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}

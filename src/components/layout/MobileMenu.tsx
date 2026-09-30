"use client";
import { SmartLink } from "@/components/ui/SmartLink";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/content/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); button.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button ref={button} type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        onClick={() => setOpen((v) => !v)} className="-mr-2 grid h-10 w-10 place-items-center text-fg">
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          {open
            ? <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            : <path d="M3 7h14M3 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
        </svg>
      </button>
      {open && (
        <nav id="mobile-menu" aria-label="모바일 메뉴" className="fixed inset-x-0 bottom-0 top-14 z-40 bg-ink-950 px-4 pt-6">
          <ul className="border-t border-white/10">
            {SITE.nav.map((item) => (
              <li key={item.href} className="border-b border-white/10">
                <SmartLink href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-4 text-xl font-semibold">
                  {item.label}<span aria-hidden="true" className="text-muted">›</span>
                </SmartLink>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">{SITE.nameKo}</p>
        </nav>
      )}
    </div>
  );
}

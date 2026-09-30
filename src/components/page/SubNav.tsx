import { SmartLink } from "@/components/ui/SmartLink";

/** 페이지 안 이동 메뉴. 헤더 아래에 붙어 따라온다. */
export function SubNav({ label, items, current }: { label: string; items: { label: string; href: string }[]; current?: string }) {
  return (
    <nav aria-label={label} className="sticky top-14 z-30 border-y border-white/10 bg-ink-950/85 backdrop-blur-md">
      <ul className="container-site flex gap-7 overflow-x-auto text-[15px]">
        {items.map((i) => (
          <li key={i.href} className="shrink-0">
            <SmartLink href={i.href} className={`block py-4 transition-colors ${current === i.href ? "font-semibold text-fg shadow-[inset_0_-2px_0_var(--color-cyan)]" : "text-fg/60 hover:text-fg"}`}>
              {i.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export const ABOUT_NAV = [
  { label: "센터 소개", href: "/about/" },
  { label: "연혁", href: "/about/#history" },
  { label: "조직도", href: "/about/organization/" },
  { label: "문의", href: "/about/#contact" },
];

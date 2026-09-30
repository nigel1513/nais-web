import Link from "next/link";

/** 레퍼런스(NVIDIA·DeepMind) 방식의 텍스트 링크: 굵은 라벨 + 호버 시 밀려나는 화살표. */
export function TextLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const cls = `group inline-flex items-center gap-1.5 text-[15px] font-medium text-fg transition-colors hover:text-cyan ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="transition-transform duration-200 group-hover:translate-x-1">
        <path d="M5 2.5 9.5 7 5 11.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );
  return href.startsWith("#") ? <a href={href} className={cls}>{inner}</a> : <Link href={href} className={cls}>{inner}</Link>;
}

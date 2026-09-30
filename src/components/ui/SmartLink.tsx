import Link from "next/link";

/** 외부 주소(http)는 새 탭으로 여는 일반 앵커, 내부 경로는 Next.js Link로 렌더링한다. */
export function SmartLink({ href, className, children, onClick, ariaCurrent }: { href: string; className?: string; children: React.ReactNode; onClick?: () => void; ariaCurrent?: "page" }) {
  if (/^https?:/.test(href)) return <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>{children}</a>;
  if (href.startsWith("#") || href.endsWith(".xml")) return <a href={href} className={className} onClick={onClick} aria-current={ariaCurrent}>{children}</a>;
  return <Link href={href} className={className} onClick={onClick} aria-current={ariaCurrent}>{children}</Link>;
}

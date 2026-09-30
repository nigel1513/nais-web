/** 큰 번호와 제목·설명으로 구성한 타이포그래피 목록(구분선 없음). */
export function IndexedList({ items }: { items: { title: string; body: string; badge?: string }[] }) {
  return (
    <ol className="space-y-7">
      {items.map((it, i) => (
        <li data-reveal key={it.title} className="group grid grid-cols-[3.25rem_1fr] gap-x-4">
          <span className="font-mono text-[1.9rem] font-light leading-none tabular-nums text-fg/20 transition-colors duration-300 group-hover:text-cyan">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="flex items-baseline gap-2 text-[1.3rem] font-semibold leading-tight tracking-[-0.02em]">
              {it.title}
              {it.badge && <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-cyan">{it.badge}</span>}
            </h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{it.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import type { Article } from "@/content/pages";

const CATEGORIES = ["전체", "공모", "행사", "채용"] as const;
const fmt = (d: string) => d.replaceAll("-", ".");

export function NewsList({ articles }: { articles: Article[] }) {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("전체");
  const list = cat === "전체" ? articles : articles.filter((a) => a.category === cat);
  return (
    <div>
      <div role="tablist" aria-label="소식 분류" className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} aria-controls="news-list" onClick={() => setCat(c)}
            className={`press rounded-full px-4 py-2 text-sm ${cat === c ? "bg-fg font-semibold text-ink-950" : "border border-white/15 text-fg/70 hover:text-fg"}`}>
            {c}
          </button>
        ))}
      </div>
      <div key={cat} id="news-list" role="tabpanel" className="swap-in mt-12 space-y-12">
        {list.map((a) => (
          <article key={a.slug} className="group grid gap-3 md:grid-cols-[9rem_1fr] md:gap-10">
            <div className="flex gap-3 md:block">
              <time dateTime={a.date} className="font-mono text-[1.35rem] font-light tabular-nums text-fg/40 transition-colors group-hover:text-cyan">{fmt(a.date)}</time>
              <p className="text-[13px] text-cyan md:mt-2">{a.category}</p>
            </div>
            <div>
              <h2 className="text-[1.5rem] font-semibold leading-snug tracking-[-0.02em]">
                <Link href={`/news/${a.slug}/`} className="transition-colors hover:text-cyan">{a.title}</Link>
              </h2>
              <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-muted">{a.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

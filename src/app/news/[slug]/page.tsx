import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES } from "@/content/pages";
import { SmartLink } from "@/components/ui/SmartLink";
import { TextLink } from "@/components/ui/TextLink";

export const dynamicParams = false;
export function generateStaticParams() { return ARTICLES.map((a) => ({ slug: a.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  return a ? { title: a.title, description: a.summary } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();
  return (
    <article className="container-site pb-32 pt-36">
      <TextLink href="/news/" className="text-sm">소식 목록</TextLink>
      <div className="mt-10 flex items-center gap-3 text-[14px]">
        <span className="text-cyan">{a.category}</span>
        <time dateTime={a.date} className="font-mono tabular-nums text-muted">{a.date.replaceAll("-", ".")}</time>
      </div>
      <h1 className="mt-4 max-w-4xl text-[2.2rem] font-bold leading-tight tracking-[-0.03em] md:text-[3.2rem]">{a.title}</h1>
      <div className="mt-10 max-w-2xl space-y-6 text-[17px] leading-[1.9] text-fg/85">
        {a.body.map((p) => <p key={p}>{p}</p>)}
      </div>
      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
        {a.link && (
          <SmartLink href={a.link.href} className="inline-flex h-11 items-center rounded-full bg-fg px-6 text-[15px] font-semibold text-ink-950 press hover:bg-cyan">
            {a.link.label}
          </SmartLink>
        )}
        <SmartLink href={a.source.href} className="text-sm text-muted transition-colors hover:text-fg">출처: {a.source.label} ↗</SmartLink>
      </div>
    </article>
  );
}

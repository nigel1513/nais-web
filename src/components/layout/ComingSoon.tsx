import Link from "next/link";

export function ComingSoon({ title, summary }: { title: string; summary: string }) {
  return (
    <section className="container-site flex min-h-[70vh] flex-col justify-center gap-5 pt-28">
      <p className="eyebrow">NAIS</p>
      <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
      <p className="text-lg text-muted">{summary}</p>
      <p className="text-sm text-muted">이 페이지는 준비 중입니다.</p>
      <Link href="/" className="font-mono text-sm text-cyan hover:underline">홈으로</Link>
    </section>
  );
}

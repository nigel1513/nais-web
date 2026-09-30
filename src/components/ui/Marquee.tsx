/** 끝없이 흐르는 큰 글자 띠. 장식이므로 aria-hidden, 내용은 별도의 sr-only 목록으로 제공한다. */
export function Marquee({ items, reverse = false, outline = false }: { items: string[]; reverse?: boolean; outline?: boolean }) {
  const row = items.join("   ·   ");
  return (
    <div data-marquee aria-hidden="true" className="overflow-hidden whitespace-nowrap">
      <div className={`marquee-track inline-flex ${reverse ? "marquee-reverse" : ""}`}>
        {[0, 1].map((k) => (
          <span key={k} className={`pr-[0.6em] text-[2.4rem] font-semibold leading-tight tracking-[-0.02em] md:text-[3.6rem] ${outline ? "marquee-outline" : "text-fg/85"}`}>
            {row}   ·   
          </span>
        ))}
      </div>
    </div>
  );
}

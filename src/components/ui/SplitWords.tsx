/** 제목을 단어 단위로 나눠 순서대로 떠오르게 한다. 공백을 텍스트로 남겨 접근성 이름은 원문 그대로 유지된다. */
export function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span data-words>
      {words.map((w, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span data-word style={{ "--i": i } as React.CSSProperties}>{w}</span>
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

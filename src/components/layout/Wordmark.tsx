export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark inline-flex items-center gap-2 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="9.5" fill="none" stroke="var(--color-cyan)" strokeWidth="1.2" />
        <circle cx="11" cy="11" r="2.4" fill="var(--color-cyan)" />
        <circle cx="4.5" cy="7" r="1.3" fill="var(--color-blue)" />
        <circle cx="17" cy="15.5" r="1.3" fill="var(--color-blue)" />
        <path d="M4.5 7 L11 11 L17 15.5" stroke="var(--color-cyan)" strokeWidth="0.8" opacity="0.7" />
      </svg>
      <span className="font-mono text-[15px] font-medium tracking-[0.18em]">NAIS</span>
    </span>
  );
}

export function particleCount(o: { width: number; cores?: number; reducedMotion: boolean }): number {
  let n = o.reducedMotion ? 8000 : o.width >= 1024 ? 40000 : o.width >= 640 ? 20000 : 8000;
  if (o.cores !== undefined && o.cores <= 4) n = Math.max(5000, Math.floor(n / 2));
  return n;
}

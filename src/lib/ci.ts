export const CI_MAX_WIDTH = 168;
const BASE_HEIGHT = 56;

/**
 * 로고의 가로세로 비율이 달라도 눈에 보이는 크기가 비슷해지도록 높이를 정한다.
 * 높이를 비율의 -0.5승으로 줄이면 면적(가로×세로)이 일정하게 유지된다. 너무 긴 로고는 최대 폭에 맞춘다.
 */
export function ciSize(w: number, h: number): { width: number; height: number } {
  const ratio = w / h;
  let height = BASE_HEIGHT / Math.sqrt(ratio);
  let width = height * ratio;
  if (width > CI_MAX_WIDTH) { width = CI_MAX_WIDTH; height = width / ratio; }
  const r1 = (v: number) => Math.round(v * 10) / 10;
  return { width: r1(width), height: r1(height) };
}

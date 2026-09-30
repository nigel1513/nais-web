import { network } from "./network";
import { korea } from "./korea";

/** STATES 순서. 모든 섹션이 같은 네트워크 구름(동일 배열)을 쓰고, 생태계 섹션만 한반도 지도로 모인다. */
export function buildAllTargets(count: number): Float32Array[] {
  const s = network(count);
  const k = korea(count);
  return [s, s, s, s, s, k, s];
}

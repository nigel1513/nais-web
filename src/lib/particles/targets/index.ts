import { sphere } from "./sphere";
import { mesh } from "./mesh";
import { loop } from "./loop";

/** STATES 순서: sphere, mesh, convergence, loop, moonshot, korea, sphereFinal */
export function buildAllTargets(count: number): Float32Array[] {
  const s = sphere(count);
  // Task 7에서 convergence·moonshot·korea로 교체한다(프로토타입 단계 임시값).
  return [s, mesh(count), s, loop(count), s, s, s];
}

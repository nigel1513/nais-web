import { sphere } from "./sphere";
import { mesh } from "./mesh";
import { convergence } from "./convergence";
import { loop } from "./loop";
import { moonshot } from "./moonshot";
import { korea } from "./korea";

/** STATES 순서: sphere, mesh, convergence, loop, moonshot, korea, sphereFinal(같은 구 좌표, 설정만 다름) */
export function buildAllTargets(count: number): Float32Array[] {
  const s = sphere(count);
  return [s, mesh(count), convergence(count), loop(count), moonshot(count), korea(count), s];
}

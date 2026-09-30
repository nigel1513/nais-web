export type Vec3 = [number, number, number];

/** 셰이더 xf()와 동일: 먼저 y축으로 time*spin 회전, 다음 x축으로 tilt 기울임 */
export function applyStateTransform(p: Vec3, spin: number, tilt: number, time: number): Vec3 {
  const a = time * spin;
  const ca = Math.cos(a), sa = Math.sin(a);
  const x1 = ca * p[0] + sa * p[2];
  const y1 = p[1];
  const z1 = -sa * p[0] + ca * p[2];
  const ct = Math.cos(tilt), st = Math.sin(tilt);
  const r: Vec3 = [x1, ct * y1 - st * z1, st * y1 + ct * z1];
  return r.map((v) => (Math.abs(v) < 1e-12 ? 0 : v)) as Vec3;
}

/** ParticleSystem 그룹 변환(scale → y축 yaw → x축 tilt)과 같은 결과를 계산한다. 라벨·레이아웃 검사에 쓴다. */
export function applyLook(p: Vec3, look: { scale: number; yaw: number; tilt: number }): Vec3 {
  const s: Vec3 = [p[0] * look.scale, p[1] * look.scale, p[2] * look.scale];
  return applyStateTransform(s, 1, look.tilt, look.yaw);
}

import { expect, test } from "vitest";
import * as THREE from "three";
import { STATES, STATE_CONFIG } from "@/lib/particles/states";
import { applyLook } from "@/lib/particles/transform";
import { buildAllTargets } from "@/lib/particles/targets";

// 데스크톱 1440×900에서 텍스트 열(max-w-7xl 컨테이너의 5/12)은 화면 폭의 약 43%까지 차지한다.
const W = 1440, H = 900, TEXT_EDGE = 0.43; // 흐름 변위(최대 약 0.3)는 여유 폭으로 흡수한다
const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
camera.position.set(0, 0, 6);
camera.updateMatrixWorld();

const targets = buildAllTargets(4000);

test.each(STATES.map((s, i) => [s, i] as const))("%s stays right of the text column and inside the viewport on desktop", (name, i) => {
  const cfg = STATE_CONFIG[name];
  const a = targets[i];
  const v = new THREE.Vector3();
  let inside = 0, clipped = 0;
  const n = a.length / 3;
  for (let k = 0; k < n; k++) {
    const p = applyLook([a[k * 3], a[k * 3 + 1], a[k * 3 + 2]], cfg);
    v.set(p[0] + cfg.offsetX, p[1], p[2]).project(camera);
    const sx = (v.x + 1) / 2, sy = (1 - v.y) / 2;
    if (sx < TEXT_EDGE) inside++;
    if (sx > 1 || sy < 0.06 || sy > 1) clipped++; // 오른쪽 끝·헤더(상단 6%)·하단 밖
  }
  expect(inside / n).toBeLessThan(0.01);
  expect(clipped / n).toBeLessThan(0.01);
});

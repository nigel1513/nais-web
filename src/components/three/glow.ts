import * as THREE from "three";

const glowVertex = /* glsl */ `
uniform float uPixelRatio, uScale;
attribute float aSize;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uScale * uPixelRatio / -mv.z;
}`;
const glowFragment = /* glsl */ `
uniform vec3 uColor; uniform float uOpacity;
void main(){
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  float core = smoothstep(0.5, 0.0, r);
  gl_FragColor = vec4(uColor, (pow(core, 2.2) + 0.35 * core) * uOpacity);
}`;

export function glowPoints(positions: number[][], size: number | number[], color: THREE.Color) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions.flat()), 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(positions.map((_, i) => (Array.isArray(size) ? size[i] : size))), 1));
  const m = new THREE.ShaderMaterial({
    vertexShader: glowVertex, fragmentShader: glowFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uPixelRatio: { value: 1 }, uScale: { value: 1 }, uColor: { value: color }, uOpacity: { value: 0 } },
  });
  const p = new THREE.Points(g, m);
  p.frustumCulled = false;
  return p;
}


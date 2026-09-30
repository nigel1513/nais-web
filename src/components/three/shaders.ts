// Ashima Arts 3D simplex noise (MIT) + 유한 차분 curl
const noise = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z); vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy; vec4 y = y_ * ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0; vec4 s1 = floor(b1) * 2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y); vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
vec3 curl(vec3 p){
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0), dy = vec3(0.0, e, 0.0), dz = vec3(0.0, 0.0, e);
  float x = (snoise(p + dy) - snoise(p - dy)) - (snoise(p + dz) - snoise(p - dz));
  float y = (snoise(p + dz) - snoise(p - dz)) - (snoise(p + dx) - snoise(p - dx));
  float z = (snoise(p + dx) - snoise(p - dx)) - (snoise(p + dy) - snoise(p - dy));
  return vec3(x, y, z) / (2.0 * e);
}
`;

export const pointsVertex = /* glsl */ `
${noise}
uniform float uProgress, uFlowTime, uSwirl, uPixelRatio, uSize, uFlow, uBrightness, uHue;
attribute vec3 aFrom; attribute vec3 aTo; attribute float aSeed; attribute vec3 aScatter;
varying float vAlpha; varying float vSeed; varying float vGlow; varying float vHue;
void main(){
  // 구 ↔ 한반도 모핑(입자마다 시작 시점을 달리해 흩어졌다 모이게)
  float d = aSeed * 0.35;
  float t = clamp((uProgress - d) / 0.65, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 p = mix(aFrom, aTo, t) + aScatter * sin(t * 3.14159265) * 0.35;

  // 소용돌이: 중심축에 가까울수록 크게 비튼다. 누적하지 않으므로 세기가 0이 되면 원래 모양으로 돌아온다
  float r = length(p.xz) + 0.35;
  float ang = uSwirl * (0.9 + 0.35 * sin(uFlowTime * 0.6 + aSeed * 6.2832)) / r;
  float c = cos(ang), s = sin(ang);
  p.xz = vec2(c * p.x - s * p.z, s * p.x + c * p.z);

  // curl noise 유체 흐름
  // curl 값은 대략 ±3~5 범위라 0.1배로 정규화해 잔잔한 흐름(변위 ≈ 0.1)으로 만든다
  p += curl(p * 0.7 + vec3(0.0, 0.0, uFlowTime * 0.18)) * uFlow * 0.1 * (0.4 + aSeed * 0.6);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float star = step(0.985, aSeed);
  gl_PointSize = uSize * uPixelRatio * (0.5 + aSeed * 0.9) * (1.0 + star * 1.0) / -mv.z;
  float depth = smoothstep(9.5, 3.8, -mv.z);
  vAlpha = uBrightness * (0.28 + 0.72 * aSeed) * (0.45 + 0.55 * depth);
  vSeed = aSeed; vGlow = star; vHue = uHue;
}`;

export const pointsFragment = /* glsl */ `
uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;
varying float vAlpha; varying float vSeed; varying float vGlow; varying float vHue;
void main(){
  vec2 q = gl_PointCoord - 0.5;
  float r = length(q);
  if (r > 0.5) discard;
  float core = smoothstep(0.5, 0.0, r);
  float halo = mix(core, pow(core, 3.0) + 0.25 * core, vGlow);
  vec3 col = mix(uColorA, uColorB, vSeed);
  col = mix(col, uColorC, clamp(vHue * vSeed + vGlow * 0.7, 0.0, 1.0));
  gl_FragColor = vec4(col, halo * vAlpha * 0.9);
}`;

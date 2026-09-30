const xf = /* glsl */ `
uniform float uTime;
vec3 rotY(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z); }
vec3 tiltX(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }
vec3 xf(vec3 p, float spin, float tilt){ return tiltX(rotY(p, uTime*spin), tilt); }
`;

export const pointsVertex = /* glsl */ `
${xf}
uniform float uProgress, uPixelRatio, uSize, uFromSpin, uToSpin, uFromTilt, uToTilt, uBrightness;
attribute vec3 aFrom; attribute vec3 aTo; attribute float aSeed; attribute vec3 aScatter;
varying float vAlpha; varying float vSeed;
void main(){
  float d = aSeed * 0.35;
  float t = clamp((uProgress - d) / 0.65, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 a = xf(aFrom, uFromSpin, uFromTilt);
  vec3 b = xf(aTo, uToSpin, uToTilt);
  vec3 p = mix(a, b, t) + aScatter * sin(t * 3.14159265) * 0.6;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.6 + aSeed * 0.8) / -mv.z;
  vAlpha = uBrightness * (0.35 + 0.65 * aSeed);
  vSeed = aSeed;
}`;

export const pointsFragment = /* glsl */ `
uniform vec3 uColorA; uniform vec3 uColorB;
varying float vAlpha; varying float vSeed;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float f = smoothstep(0.5, 0.0, r);
  gl_FragColor = vec4(mix(uColorA, uColorB, vSeed), f * vAlpha * 0.9);
}`;

export const linesVertex = /* glsl */ `
${xf}
uniform float uSpin, uTilt;
void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(xf(position, uSpin, uTilt), 1.0); }`;

export const linesFragment = /* glsl */ `
uniform vec3 uColor; uniform float uOpacity;
void main(){ gl_FragColor = vec4(uColor, uOpacity); }`;

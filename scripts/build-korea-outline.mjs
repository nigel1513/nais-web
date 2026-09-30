// Natural Earth 1:10m Admin 0 (퍼블릭 도메인)에서 한국(KOR)·북한(PRK) 외곽선을 추출한다. 각 링에 국가 코드를 붙인다.
import { writeFile } from "node:fs/promises";

const URL_NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson";
const MIN_POINTS = 20; // 아주 작은 섬은 제외
const STEP = 2;         // 점을 한 칸씩 건너뛰어 용량을 줄인다

const geo = await (await fetch(URL_NE)).json();
const rings = [];
for (const f of geo.features) {
  if (!["KOR", "PRK"].includes(f.properties.ADM0_A3)) continue;
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) {
    const outer = poly[0];
    if (outer.length < MIN_POINTS) continue;
    const pts = outer.filter((_, i) => i % STEP === 0 || i === outer.length - 1).map(([x, y]) => [+x.toFixed(4), +y.toFixed(4)]);
    rings.push({ country: f.properties.ADM0_A3, points: pts });
  }
}
await writeFile(new URL("../src/content/korea-outline.json", import.meta.url), JSON.stringify(rings));
console.log(`rings: ${rings.length}, points: ${rings.reduce((s, r) => s + r.points.length, 0)}`);

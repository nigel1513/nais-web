// Natural Earth 1:50m Admin 0 (퍼블릭 도메인)에서 한국(KOR)·북한(PRK) 외곽선만 추출한다.
import { writeFile } from "node:fs/promises";

const URL_NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson";
const MIN_POINTS = 12; // 작은 섬은 제외

const geo = await (await fetch(URL_NE)).json();
const rings = [];
for (const f of geo.features) {
  if (!["KOR", "PRK"].includes(f.properties.ADM0_A3)) continue;
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) {
    const outer = poly[0];
    if (outer.length >= MIN_POINTS) rings.push(outer.map(([x, y]) => [+x.toFixed(4), +y.toFixed(4)]));
  }
}
await writeFile(new URL("../src/content/korea-outline.json", import.meta.url), JSON.stringify(rings));
console.log(`rings: ${rings.length}, points: ${rings.flat().length}`);

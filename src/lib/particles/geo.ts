const LON0 = 127.6, LAT0 = 38.05, S = 0.43, KX = Math.cos((37 * Math.PI) / 180);

/** 경위도 → 월드 좌표(XY 평면). 한반도(124–131°E, 33–43°N)가 ±3 안에 들어온다. */
export function project(lon: number, lat: number): [number, number] {
  return [(lon - LON0) * KX * S * 1.1, (lat - LAT0) * S];
}

export function pointInRing(x: number, y: number, ring: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function samplePerimeter(ring: [number, number][], t: number): [number, number] {
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < ring.length; i++) {
    const l = Math.hypot(ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]);
    seg.push(l); total += l;
  }
  let target = (((t % 1) + 1) % 1) * total;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i] || i === seg.length - 1) {
      const k = seg[i] === 0 ? 0 : Math.min(1, target / seg[i]);
      return [ring[i][0] + (ring[i + 1][0] - ring[i][0]) * k, ring[i][1] + (ring[i + 1][1] - ring[i][1]) * k];
    }
    target -= seg[i];
  }
  return ring[0];
}

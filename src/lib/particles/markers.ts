import { project } from "./geo";
import { INSTITUTES } from "@/content/institutes";

/** 대덕(NAIS 허브) 위치. 지도 좌표계(XY 평면, z=0). */
export const HUB: [number, number] = project(127.36, 36.38);

/** 지도 위 25개 소관 연구기관 마커(실제 소재지, 모두 같은 모양) */
export const MAP_MARKERS: { code: string; p: [number, number] }[] = INSTITUTES.map((i) => ({ code: i.code, p: project(i.lon, i.lat) }));


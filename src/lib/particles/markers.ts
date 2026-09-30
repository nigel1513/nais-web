import { project } from "./geo";
import { INSTITUTES } from "@/content/institutes";

/** 대덕(NAIS 허브) 위치. 지도 좌표계(XY 평면, z=0). */
export const HUB: [number, number] = project(127.36, 36.38);

/** 지도 위 25개 소관 연구기관 마커(실제 소재지). 대덕 기관은 CALLOUT 상자에 따로 목록으로 보여 준다. */
export const MAP_MARKERS: { code: string; p: [number, number]; daedeok: boolean }[] =
  INSTITUTES.map((i) => ({ code: i.code, p: project(i.lon, i.lat), daedeok: i.city === "대전" }));

/** 대덕연구개발특구 설명 상자 위치(지도 오른쪽 바다) */
export const CALLOUT: [number, number] = [0.95, HUB[1] + 0.62];

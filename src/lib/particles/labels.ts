import type { StateName } from "./states";
import type { Vec3 } from "./transform";
import { HUB } from "./flows";

export const STATE_LABELS: Partial<Record<StateName, { text: string; p: Vec3 }[]>> = {
  ecosystem: [{ text: "NAIS", p: [HUB[0], HUB[1], 0] }],
};

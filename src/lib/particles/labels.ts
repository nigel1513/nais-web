import type { StateName } from "./states";
import type { Vec3 } from "./transform";
import { MESH_LABEL_ANCHORS } from "./targets/mesh";
import { CONVERGENCE_LABELS } from "./targets/convergence";
import { LOOP_STATIONS } from "./targets/loop";
import { MOONSHOT_NODES } from "./targets/moonshot";
import { LOOP_STAGES } from "@/content/home";
import { HUB } from "./flows";

export const STATE_LABELS: Partial<Record<StateName, { text: string; p: Vec3 }[]>> = {
  mesh: MESH_LABEL_ANCHORS,
  convergence: CONVERGENCE_LABELS,
  loop: LOOP_STATIONS.map((p, i) => ({ text: LOOP_STAGES[i], p })),
  moonshot: MOONSHOT_NODES.map((p, i) => ({ text: String(i + 1).padStart(2, "0"), p })),
  korea: [{ text: "NAIS", p: [HUB[0], HUB[1], 0] }],
};

import { createStore } from "zustand/vanilla";
import type { ResolvedState } from "./resolve";

export const particleStore = createStore<ResolvedState>(() => ({ from: 0, to: 0, t: 1 }));

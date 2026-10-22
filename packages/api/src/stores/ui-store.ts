import { create } from "zustand";

import type { SectionId } from "../types.ts";

type UiState = {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
};

export const useUiStore = create<UiState>((set) => ({
  activeSection: "dashboard",
  setActiveSection: (activeSection) => set({ activeSection }),
}));

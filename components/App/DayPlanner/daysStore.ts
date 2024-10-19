import { Tess_ChunksType, TessDayLogType } from "@/app/config/commonTypes";
import { create } from "zustand";

export interface DayPlannerStore {
  days: TessDayLogType[] | null;
  hasLoadedData: boolean;
  setHasLoadedData: (hasLoadedData: boolean) => void;
  setDays: (days: TessDayLogType[] | null) => void;
  lastChunk: Tess_ChunksType | null;
  setLastChunk: (lastChunk: Tess_ChunksType | null) => void;
}

const useDayPlannerStore = create<DayPlannerStore>((set) => ({
  days: null,
  lastChunk: null,
  setLastChunk: (lastChunk) => set({ lastChunk }),
  hasLoadedData: false,
  setHasLoadedData: (hasLoadedData) => set({ hasLoadedData }),
  setDays: (days) => set({ days }),
}));

export { useDayPlannerStore };

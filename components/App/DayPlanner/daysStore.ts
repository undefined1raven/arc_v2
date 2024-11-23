import {
  DayClassifierType,
  Tess_ChunksType,
  TessDayLogType,
} from "@/app/config/commonTypes";
import { create } from "zustand";

export type DerivedDaysScoreType = {
  [key: string]: {
    completionPercentage: number;
    currentDayClass: DayClassifierType | null;
  };
};

export interface DayPlannerStore {
  days: TessDayLogType[] | null;
  hasLoadedData: boolean;
  setHasLoadedData: (hasLoadedData: boolean) => void;
  setDays: (days: TessDayLogType[] | null) => void;
  lastChunk: Tess_ChunksType | null;
  derivedDays: {
    completionScore: DerivedDaysScoreType;
    daysByMonth: object;
  };
  setDerivedDays: (newDerivedDays: {
    completionScore: DerivedDaysScoreType;
    daysByMonth: object;
  }) => void;
  setLastChunk: (lastChunk: Tess_ChunksType | null) => void;
}

const useDayPlannerStore = create<DayPlannerStore>((set, get) => ({
  days: null,
  lastChunk: null,
  setLastChunk: (lastChunk) => set({ lastChunk }),
  hasLoadedData: false,
  derivedDays: { completionScore: {}, daysByMonth: {} },
  setDerivedDays: (newDerivedDays) => set({ derivedDays: newDerivedDays }),
  setHasLoadedData: (hasLoadedData) => set({ hasLoadedData }),
  setDays: (days) => set({ days }),
}));

export { useDayPlannerStore };

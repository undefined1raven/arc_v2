import { ARC_ChunksType, ArcTaskLogType } from "@/app/config/commonTypes";
import { create } from "zustand";

interface ArcCurrentActivitiesStore {
  currentActivities: ArcTaskLogType[];
  ini: boolean;
  setCurrentActivities: (newCurrentActivities: ArcTaskLogType[]) => void;
  appendCurrentActivities: (newActivity: ArcTaskLogType) => void;
  removeActivityByID: (taskID: string) => void;
  setIni: (newIni: boolean) => void;
  lastChunk: null | ARC_ChunksType;
  setLastChunk: (newLastChunk: ARC_ChunksType) => void;
  setByDayDerivedActivities: (newDerivedActivities: {
    byDay: { [key: string]: ArcTaskLogType[] };
  }) => void;
  setDurationMap: (newDurationMap: { [key: string]: number }) => void;
  setCumulativeDuration: (newCumulativeDuration: {
    [key: string]: number;
  }) => void;
  derivedActivities: {
    byDay: string[];
    durationMap: { [key: string]: number };
    cumulativeDurationMap: { [key: string]: number };
  };
}

const useArcCurrentActivitiesStore = create<ArcCurrentActivitiesStore>(
  (set) => ({
    lastChunk: null,
    setLastChunk: (newLastChunk) => {
      set({ lastChunk: newLastChunk });
    },
    setByDayDerivedActivities: (newDerivedActivities) => {
      set((state) => {
        return {
          derivedActivities: {
            ...state.derivedActivities,
            byDay: newDerivedActivities.byDay,
          },
        };
      });
    },
    currentActivities: [],
    setDurationMap: (newDurationMap) => {
      set((state) => {
        return {
          derivedActivities: {
            ...state.derivedActivities,
            durationMap: newDurationMap,
          },
        };
      });
    },
    setCumulativeDuration: (newCumulativeDuration) => {
      set((state) => {
        return {
          derivedActivities: {
            ...state.derivedActivities,
            cumulativeDurationMap: newCumulativeDuration,
          },
        };
      });
    },
    derivedActivities: {
      byDay: [],
      durationMap: {},
      cumulativeDurationMap: {},
    },
    ini: false,
    setCurrentActivities: (newCurrentActivities) => {
      set((state) => {
        return { currentActivities: newCurrentActivities };
      });
    },
    appendCurrentActivities: (newActivity) => {
      set((state) => {
        return { currentActivities: [...state.currentActivities, newActivity] };
      });
    },
    removeActivityByID: (taskID: string) => {
      set((state) => {
        return {
          currentActivities: state.currentActivities.filter(
            (activity) => activity.taskID !== taskID
          ),
        };
      });
    },
    setIni: (newIni: boolean) => {
      set((state) => {
        return { ini: newIni };
      });
    },
  })
);

export { useArcCurrentActivitiesStore };

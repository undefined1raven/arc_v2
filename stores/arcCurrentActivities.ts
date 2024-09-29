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
  derivedActivities: {
    byDay: {
      start: Number;
      end: Number;
      dayDisplayStr: string;
      activities: ArcTaskLogType[];
    }[];
  };
}

const useArcCurrentActivitiesStore = create<ArcCurrentActivitiesStore>(
  (set) => ({
    lastChunk: null,
    setLastChunk: (newLastChunk) => {
      set({ lastChunk: newLastChunk });
    },
    currentActivities: [],
    derivedActivities: { byDay: [] },
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

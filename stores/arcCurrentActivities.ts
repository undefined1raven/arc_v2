import { ArcTaskLogType } from "@/app/config/commonTypes";
import { create } from "zustand";

interface ArcCurrentActivitiesStore {
  currentActivities: ArcTaskLogType[];
  ini: boolean;
  setCurrentActivities: (
    newCurrentActivities: ArcTaskLogType[]
  ) => void;
  appendCurrentActivities: (newActivity: ArcTaskLogType) => void;
  removeActivityByID: (taskID: string) => void;
  setIni: (newIni: boolean) => void;
}

const useArcCurrentActivitiesStore = create<ArcCurrentActivitiesStore>(
  (set) => ({
    currentActivities: [],
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

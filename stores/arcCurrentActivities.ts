import { create } from "zustand";

interface ArcCurrentActivitiesStore {
  currentActivities: { taskID: string; tx: number }[];
  ini: boolean;
  setCurrentActivities: (newCurrentActivities: { taskID: string; tx: number }[]) => void;
  appendCurrentActivities: (newActivity: {
    taskID: string;
    tx: number;
  }) => void;
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

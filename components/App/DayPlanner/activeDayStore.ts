import { TessDayLogType, TessTaskType } from "@/app/config/commonTypes";
import { create } from "zustand";

interface ActiveDayState {
  activeDay: TessDayLogType | null;
  setActiveDay: (day: TessDayLogType | null) => void;
  clearActiveDay: () => void;
  selectedTask: TessTaskType | null;
  setSelectedTask: (task: TessTaskType | null) => void;
}

const useActiveDayStore = create<ActiveDayState>((set) => ({
  activeDay: null,
  selectedTask: null,
  setSelectedTask: (task: TessTaskType | null) => set({ selectedTask: task }),
  setActiveDay: (day: TessDayLogType | null) => set({ activeDay: day }),
  clearActiveDay: () => set({ activeDay: null }),
}));

export { useActiveDayStore };

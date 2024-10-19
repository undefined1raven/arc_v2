import { TessDayLogType } from "@/app/config/commonTypes";
import { create } from "zustand";

interface ActiveDayState {
  activeDay: TessDayLogType | null;
  setActiveDay: (day: TessDayLogType | null) => void;
  clearActiveDay: () => void;
}

const useActiveDayStore = create<ActiveDayState>((set) => ({
  activeDay: null,
  setActiveDay: (day: TessDayLogType | null) => set({ activeDay: day }),
  clearActiveDay: () => set({ activeDay: null }),
}));

export { useActiveDayStore };

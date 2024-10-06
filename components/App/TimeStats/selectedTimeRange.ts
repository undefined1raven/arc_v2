import { create } from "zustand";

interface TimeRange {
  start: number;
  end: number;
}

interface TimeStatsState {
  selectedTimeRange: TimeRange;
  selectedDay: string | null;
  setSelectedDay: (day: string | null) => void;
  setSelectedTimeRange: (timeRange: TimeRange) => void;
}

export const useTimeStatsStore = create<TimeStatsState>((set) => ({
  selectedTimeRange: {
    start: Date.now() - 1000 * 60 * 60 * 24 * 7,
    end: Date.now(),
  },
  selectedDay: null,
  setSelectedDay: (day: string | null) => set(() => ({ selectedDay: day })),
  setSelectedTimeRange: (timeRange: TimeRange) =>
    set(() => ({ selectedTimeRange: timeRange })),
}));

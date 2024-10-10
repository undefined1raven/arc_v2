import { ARCCategoryType, ARCTasksType } from "@/app/config/commonTypes";
import { create } from "zustand";

interface selectedObjectsState {
  selectedActivity: ARCTasksType | null;
  setSelectedActivity: (activity: ARCTasksType | null) => void;
  selectedCategory: ARCCategoryType | null;
  setSelectedCategory: (category: ARCCategoryType | null) => void;
}

export const useSelectedObjects = create<selectedObjectsState>((set) => ({
  selectedActivity: null,
  setSelectedActivity: (activity) => set({ selectedActivity: activity }),
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));

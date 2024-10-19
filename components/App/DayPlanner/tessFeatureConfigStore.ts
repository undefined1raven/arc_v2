import { FeatureConfigTessType } from "@/app/config/commonTypes";
import { create } from "zustand";

interface TessFeatureConfigState {
  tessFeatureConfig: FeatureConfigTessType | null;
  setTessFeatureConfig: (tessFeatureConfig: FeatureConfigTessType) => void;
}

const useTessFeatureConfigStore = create<TessFeatureConfigState>((set) => ({
  tessFeatureConfig: null,
  setTessFeatureConfig: (tessFeatureConfig) => set({ tessFeatureConfig }),
}));

export { useTessFeatureConfigStore };

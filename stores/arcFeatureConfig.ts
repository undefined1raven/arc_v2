import arcFeatureConfig from "@/hooks/arcFeatureConfig";
import { create } from "zustand";

const useArcFeatureConfigStore = create((set) => ({
  arcFeatureConfig: {},
  updateArcFeatureConfig: (state, update) => {
    return { arcFeatureConfig: { ...state, ...update } };
  },
}));

export { useArcFeatureConfigStore };

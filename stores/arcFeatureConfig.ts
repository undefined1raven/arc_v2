import { FeatureConfigArcType } from "@/app/config/commonTypes";
import arcFeatureConfig from "@/hooks/arcFeatureConfig";
import { create } from "zustand";

interface ArcFeatureConfigStoreType {
  arcFeatureConfig: FeatureConfigArcType | null;
  updateArcFeatureConfig: (
    update: FeatureConfigArcType
  ) => ArcFeatureConfigStoreType;
  setArcFeatureConfig: (
    arcFeatureConfig: FeatureConfigArcType
  ) => ArcFeatureConfigStoreType;
}

const useArcFeatureConfigStore = create<ArcFeatureConfigStoreType>(
  (set, get) => ({
    arcFeatureConfig: null,
    setArcFeatureConfig: (arcFeatureConfig) => {
      set({ arcFeatureConfig });
    },
    updateArcFeatureConfig: (update) => {
      set((state) => {
        return { arcFeatureConfig: { ...state, ...update } };
      });
    },
  })
);

export { useArcFeatureConfigStore };

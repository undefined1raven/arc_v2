import { useArcFeatureConfigStore } from "@/stores/arcFeatureConfig";
import { useEffect } from "react";

function ArcFeatureConfigWatcher() {
  const { arcFeatureConfig } = useArcFeatureConfigStore();

  useEffect(() => {
    console.log(arcFeatureConfig?.tasks);
  }, [arcFeatureConfig]);

  return null;
}

export { ArcFeatureConfigWatcher };

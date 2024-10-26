import { defaultFeatureConfig } from "@/app/config/defaultFeatureConfig";

function migrateTessFeatureConfigFromv010Tov011(oldFeatureConfig: any) {
  let newStatusArray = oldFeatureConfig.statusArray;
  let newLabelArray = oldFeatureConfig.labelArray;
  let newDayClassifier = oldFeatureConfig.dayClassifier;
  if (
    oldFeatureConfig.statusArray.every((status) => status.version === "0.1.0")
  ) {
    newStatusArray = oldFeatureConfig.statusArray.map(
      (status: any, index: number) => {
        return {
          ...status,
          version: "0.1.1",
          colors: {
            light: {
              color:
                status?.lightColor ||
                defaultFeatureConfig.tess.statusArray[index]?.colors.light
                  .color ||
                "#999999",
              textColor:
                status?.textLightColor ||
                defaultFeatureConfig.tess.statusArray[index]?.colors.light
                  .textColor ||
                "#999999",
            },
            dark: {
              color:
                status?.darkColor ||
                defaultFeatureConfig.tess.statusArray[index]?.colors.dark
                  .color ||
                "#999999",
              textColor:
                status?.textDarkColor ||
                defaultFeatureConfig.tess.statusArray[index]?.colors.dark
                  .textColor ||
                "#999999",
            },
          },
        };
      }
    );
  }

  if (
    oldFeatureConfig.labelArray.every((label: any) => label.version === "0.1.0")
  ) {
    newLabelArray = oldFeatureConfig.labelArray.map(
      (label: any, index: number) => {
        return {
          ...label,
          version: "0.1.1",
          colors: {
            light: {
              color:
                label?.lightColor ||
                defaultFeatureConfig.tess.labelArray[index]?.colors.light
                  .color ||
                "#999999",
              textColor:
                label?.textLightColor ||
                defaultFeatureConfig.tess.labelArray[index]?.colors.light
                  .textColor ||
                "#999999",
            },
            dark: {
              color:
                label?.darkColor ||
                defaultFeatureConfig.tess.labelArray[index]?.colors.dark
                  .color ||
                "#999999",
              textColor:
                label?.textDarkColor ||
                defaultFeatureConfig.tess.labelArray[index]?.colors.dark
                  .textColor ||
                "#999999",
            },
          },
        };
      }
    );
  }

  if (newDayClassifier === undefined) {
    newDayClassifier = defaultFeatureConfig.tess.dayClassifier;
  }

  return {
    statusArray: newStatusArray,
    labelArray: newLabelArray,
    dayClassifier: newDayClassifier,
    pinProtected: oldFeatureConfig.pinProtected,
  };
}

export { migrateTessFeatureConfigFromv010Tov011 };

import { version } from "react";
import themeColors from "./colors";
import {
  ARCTasksType,
  FeatureConfigType,
  FeatureConfigArcType,
  FeatureConfigTessType,
  FeatureConfigSIDType,
} from "./commonTypes";
import { randomUUID } from "expo-crypto";

const randomCatIDs = {
  selfCare: randomUUID(),
  social: randomUUID(),
  relaxation: randomUUID(),
  meal: randomUUID(),
  workout: randomUUID(),
};

const arcDefaultConfig: FeatureConfigArcType = {
  tasks: [
    {
      taskID: `TID-${randomUUID()}`,
      name: "Sleeping",
      deleted: false,
      version: "0.1.0",
      categoryID: randomCatIDs.selfCare,
      routineConfig: {
        enabledDays: [0, 1, 2, 3, 4, 5, 6],
        isActive: false,
        timeConfig: [{ start: "22:00", end: "05:00" }],
      },
      isSpecialStatus: false,
    },
    {
      taskID: `TID-${randomUUID()}`,
      name: "Breakfast",
      deleted: false,
      version: "0.1.0",
      categoryID: randomCatIDs.meal,
      routineConfig: {
        enabledDays: [0, 1, 2, 3, 4, 5, 6],
        isActive: false,
        timeConfig: null,
      },
      isSpecialStatus: false,
    },
    {
      taskID: `TID-${randomUUID()}`,
      name: "Dinner",
      deleted: false,
      version: "0.1.0",
      categoryID: randomCatIDs.meal,
      routineConfig: {
        enabledDays: [0, 1, 2, 3, 4, 5, 6],
        isActive: false,
        timeConfig: null,
      },
      isSpecialStatus: false,
    },
    {
      taskID: `TID-${randomUUID()}`,
      name: "Walk",
      deleted: false,
      version: "0.1.0",
      categoryID: randomCatIDs.workout,
      routineConfig: {
        enabledDays: [0, 1, 2, 3, 4, 5, 6],
        isActive: false,
        timeConfig: null,
      },
      isSpecialStatus: false,
    },
    {
      taskID: `TID-${randomUUID()}`,
      name: "Running",
      deleted: false,
      version: "0.1.0",
      categoryID: randomCatIDs.workout,
      routineConfig: {
        enabledDays: [0, 1, 2, 3, 4, 5, 6],
        isActive: false,
        timeConfig: null,
      },
      isSpecialStatus: false,
    },
    {
      taskID: `TID-${randomUUID()}`,
      name: "Shower",
      deleted: false,
      version: "0.1.0",
      categoryID: randomCatIDs.selfCare,
      routineConfig: {
        enabledDays: [0, 1, 2, 3, 4, 5, 6],
        isActive: false,
        timeConfig: null,
      },
      isSpecialStatus: false,
    },
    {
      taskID: `TID-${randomUUID()}`,
      name: "Hanging Out",
      deleted: false,
      version: "0.1.0",
      categoryID: randomCatIDs.social,
      routineConfig: {
        enabledDays: [0, 1, 2, 3, 4, 5, 6],
        isActive: false,
        timeConfig: null,
      },
      isSpecialStatus: false,
    },
    {
      taskID: `TID-${randomUUID()}`,
      name: "Skin Care",
      deleted: false,
      version: "0.1.0",
      categoryID: randomCatIDs.selfCare,
      routineConfig: {
        enabledDays: [0, 1, 2, 3, 4, 5, 6],
        isActive: false,
        timeConfig: null,
      },
      isSpecialStatus: false,
    },
  ],
  taskCategories: [
    {
      categoryID: randomCatIDs.selfCare,
      name: "Self-care",
      version: "0.1.0",
      deleted: false,
    },
    {
      categoryID: randomCatIDs.social,
      name: "Social",
      version: "0.1.0",
      deleted: false,
    },
    {
      categoryID: randomCatIDs.relaxation,
      name: "Relaxation",
      version: "0.1.0",
      deleted: false,
    },
    {
      categoryID: randomCatIDs.meal,
      name: "Meal",
      version: "0.1.0",
      deleted: false,
    },
    {
      categoryID: randomCatIDs.workout,
      name: "Workout",
      version: "0.1.0",
      deleted: false,
    },
  ],
};
const tessDefaultConfig: FeatureConfigTessType = {
  statusArray: [
    {
      statusID: "SID-000000-0000-0000-000001",
      name: "To Do",
      lightColor: themeColors.light.color,
      textLightColor: themeColors.light.textColor,
      darkColor: themeColors.dark.color,
      textDarkColor: themeColors.dark.textColor,
      completionEffect: 0,
      version: "0.1.0",
      deleted: false,
    },
    {
      statusID: "SID-000000-0000-0000-000002",
      name: "Completed",
      lightColor: themeColors.light.successColor,
      textLightColor: themeColors.light.successTextColor,
      darkColor: themeColors.dark.successColor,
      textDarkColor: themeColors.dark.successTextColor,
      completionEffect: 1,
      version: "0.1.0",
      deleted: false,
    },

    {
      statusID: "SID-000000-0000-0000-000003",
      name: "Incomplete",
      lightColor: "#757120",
      textLightColor: "#757120",
      darkColor: "#A19B16",
      textDarkColor: "#A19B16",
      completionEffect: 0.5,
      version: "0.1.0",
      deleted: false,
    },

    {
      statusID: "SID-000000-0000-0000-000004",
      name: "Failed",
      lightColor: themeColors.light.errorColor,
      textLightColor: themeColors.light.errorTextColor,
      darkColor: themeColors.dark.errorColor,
      textDarkColor: themeColors.dark.errorTextColor,
      completionEffect: 0,
      version: "0.1.0",
      deleted: false,
    },
    {
      statusID: "SID-000000-0000-0000-000005",
      name: "In Progress",
      lightColor: "#2146A7",
      textLightColor: "#2146A7",
      darkColor: "#537FF2",
      textDarkColor: "#537FF2",
      completionEffect: 0.1,
      version: "0.1.0",
      deleted: false,
    },
  ],
  labelArray: [
    {
      labelID: "LID-000000-0000-0000-000001",
      name: "High Priority",
      lightColor: "#580055",
      textLightColor: "#580055",
      darkColor: "#C300BC",
      textDarkColor: "#C300BC",
      version: "0.1.0",
      deleted: false,
      completionMultiplier: (score: number) => {
        return score * 1.2;
      },
    },
    {
      labelID: "LID-000000-0000-0000-000002",
      name: "Optional",
      lightColor: "#757120",
      textLightColor: "#757120",
      darkColor: "#A19B16",
      textDarkColor: "#A19B16",
      version: "0.1.0",
      deleted: false,
      completionMultiplier: (score: number) => {
        return score * 0 + 1;
      },
    },
  ],
  pinProtected: false,
};
const sidDefaultConfig: FeatureConfigSIDType = {
  moodArray: [],
  pinProtected: false,
};

const defaultFeatureConfig: FeatureConfigType = {
  tess: tessDefaultConfig,
  arc: arcDefaultConfig,
  sid: sidDefaultConfig,
};

export { defaultFeatureConfig };

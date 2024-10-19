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
      completionEffect: 0,
      version: "0.1.0",
      deleted: false,
      colors: {
        light: {
          color: themeColors.light.color,
          textColor: themeColors.light.textColor,
        },
        dark: {
          color: themeColors.dark.color,
          textColor: themeColors.dark.textColor,
        },
      },
    },
    {
      statusID: "SID-000000-0000-0000-000002",
      name: "Completed",
      completionEffect: 1,
      version: "0.1.0",
      deleted: false,
      colors: {
        light: {
          color: themeColors.light.successColor,
          textColor: themeColors.light.successTextColor,
        },
        dark: {
          color: themeColors.dark.successColor,
          textColor: themeColors.dark.successTextColor,
        },
      },
    },

    {
      statusID: "SID-000000-0000-0000-000003",
      name: "Incomplete",
      completionEffect: 0.5,
      version: "0.1.0",
      deleted: false,
      colors: {
        light: {
          color: "#DBE03F",
          textColor: "#DBE03F",
        },
        dark: {
          color: "#3C3E09",
          textColor: "#3C3E09",
        },
      },
    },

    {
      statusID: "SID-000000-0000-0000-000004",
      name: "Failed",
      completionEffect: 0,
      version: "0.1.0",
      deleted: false,
      colors: {
        light: {
          color: themeColors.light.errorColor,
          textColor: themeColors.light.errorTextColor,
        },
        dark: {
          color: themeColors.dark.errorColor,
          textColor: themeColors.dark.errorTextColor,
        },
      },
    },
    {
      statusID: "SID-000000-0000-0000-000005",
      name: "In Progress",
      completionEffect: 0.1,
      version: "0.1.0",
      deleted: false,
      colors: {
        light: {
          color: "#3D0861",
          textColor: "#3D0861",
        },
        dark: {
          color: "#BE79EC",
          textColor: "#BE79EC",
        },
      },
    },
  ],
  labelArray: [
    {
      labelID: "LID-000000-0000-0000-000001",
      name: "High Priority",
      colors: {
        light: {
          textColor: "#580055",
          color: "#580055",
        },
        dark: {
          textColor: "#C300BC",
          color: "#C300BC",
        },
      },
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
      colors: {
        light: {
          textColor: "#757120",
          color: "#757120",
        },
        dark: {
          textColor: "#A19B16",
          color: "#A19B16",
        },
      },
      completionMultiplier: (score: number) => {
        return score * 0 + 1;
      },
    },
    {
      labelID: "LID-000000-0000-0000-000003",
      name: "Normaal",
      colors: {
        light: {
          color: themeColors.light.color,
          textColor: themeColors.light.textColor,
        },
        dark: {
          color: themeColors.dark.color,
          textColor: themeColors.dark.textColor,
        },
      },
      version: "0.1.0",
      deleted: false,
      completionMultiplier: (score: number) => {
        return score * 0 + 1;
      },
    },
  ],
  dayClassifier: [
    {
      dayClassID: "DCID-000000-0000-0000-000001",
      label: "Completed",
      threshold: 0.75,
      colors: {
        light: {
          color: themeColors.light.successColor,
          textColor: themeColors.light.successTextColor,
        },
        dark: {
          color: themeColors.dark.successColor,
          textColor: themeColors.dark.successTextColor,
        },
      },
    },
    {
      dayClassID: "DCID-000000-0000-0000-000002",
      label: "Incomplete",
      threshold: 0.25,
      colors: {
        light: {
          color: "#757120",
          textColor: "#757120",
        },
        dark: {
          color: "#A19B16",
          textColor: "#A19B16",
        },
      },
    },
    {
      dayClassID: "DCID-000000-0000-0000-000003",
      label: "Failed",
      threshold: 0.75,
      colors: {
        light: {
          color: themeColors.light.errorColor,
          textColor: themeColors.light.errorTextColor,
        },
        dark: {
          color: themeColors.dark.errorColor,
          textColor: themeColors.dark.errorTextColor,
        },
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

import { ColorValueHex } from "@/components/common/CommonTypes";
import { AvailableThemes, Themes } from "./colors";
import { BasicColorsType, GlobalStyleType } from "@/hooks/globalStyles";

type UserDataKeys = "currentActivities" | "currentMood";
type UserDataValues = {
  currentActivities: { taskID: string; tx: number }[];
  currentMood: { moodID: string; tx: number };
};
type ArcTaskLogType = {
  taskID: string;
  start: number;
  end: number | null;
};

type TessTaskType = {
  TTID: string;
  statusID: TessStatusType["statusID"];
  labels: TessLabelType["labelID"][];
  description: string;
  name: string;
  doRemind: boolean;
  start: number;
  end: number;
  deleted: boolean;
  version: "0.1.0";
};

type TessDayLogType = {
  day: string;
  tasks: TessTaskType[];
};

type ARCTasksType = {
  taskID: string;
  name: string;
  routineConfig: {
    enabledDays: number[];
    isActive: boolean;
    timeConfig: { start: string; end: string }[] | null;
  };
  deleted: boolean;
  version: "0.1.0";
  categoryID: null | string;
  isSpecialStatus: boolean;
};
type ARCCategoryType = {
  categoryID: string;
  name: string;
  deleted: boolean;
  version: "0.1.0";
};
type FeatureConfigArcType = {
  tasks: ARCTasksType[];
  taskCategories: ARCCategoryType[];
};

type TessStatusType = {
  statusID: string;
  name: string;
  deleted: boolean;
  version: "0.1.1";
  colors: {
    [key in AvailableThemes]: { [key in keyof BasicColorsType]: ColorValueHex };
  };
  completionEffect: number;
};

type TessLabelType = {
  labelID: string;
  name: string;
  colors: {
    [key in AvailableThemes]: { [key in keyof BasicColorsType]: ColorValueHex };
  };
  deleted: boolean;
  version: "0.1.1";
  completionMultiplier: Function;
};
type DayClassifierType = {
  dayClassID: string;
  threshold: number;
  colors: {
    [key in AvailableThemes]: { [key in keyof BasicColorsType]: ColorValueHex };
  };
  label: string;
  version: "0.1.1";
};

type FeatureConfigTessType = {
  statusArray: TessStatusType[];
  labelArray: TessLabelType[];
  dayClassifier: DayClassifierType[];
  pinProtected: boolean;
};

type SIDMoodType = {
  moodID: string;
  name: string;
  deleted: boolean;
  version: "0.1.0";
  lightColor: ColorValueHex;
  textLightColor: ColorValueHex;
  darkColor: ColorValueHex;
  textDarkColor: ColorValueHex;
  score: number;
};
type FeatureConfigSIDType = { moodArray: SIDMoodType[]; pinProtected: boolean };

type FeatureConfigType = {
  arc: FeatureConfigArcType;
  tess: FeatureConfigTessType;
  sid: FeatureConfigSIDType;
};

type UserData = {
  id: string;
  signupTime: string;
  publicKey: string;
  passwordHash: string | null;
  emailAddress: string | null;
  passkeys: string | null;
  PIKBackup: string | null;
  PSKBackup: string | null;
  RCKBackup: string | null;
  trustedDevices: string | null;
  oauthState: string | null;
  securityLogs: string | null;
  arcFeatureConfig: string;
  SIDFeatureConfig: string;
  tessFeatureConfig: string;
  version: "0.1.0";
};

type localDBError = { code: string }; //currently uselessp

type ARC_ChunksType = {
  id: string;
  userID: string;
  encryptedContent: string;
  tx: number;
  version: "0.1.1";
};

type Tess_ChunksType = {
  id: string;
  userID: string;
  encryptedContent: string;
  tx: number;
  version: "0.1.1";
};

type SID_ChunksType = {
  id: string;
  userID: string;
  encryptedContent: string;
  tx: number;
  version: "0.1.1";
};

type SIDGroups_ChunksType = {
  id: string;
  userID: string;
  encryptedContent: string;
  tx: number;
  version: "0.1.1";
};

type SIDGroupType = {
  groupID: string;
  name: string;
  type: "person";
  version: "0.1.1";
  metadata: {
    ring: number;
    alias: string;
    SID: string;
  };
};

type SIDNoteType = {
  noteID: string;
  groupID: string;
  version: "0.1.1";
  metadata: {
    readOnly: boolean;
    title: string;
    createdAt: number;
    updatedAt: number;
    content: string;
  };
};

export type {
  ARCTasksType,
  ARCCategoryType,
  TessStatusType,
  SIDNoteType,
  TessLabelType,
  TessDayLogType,
  SIDMoodType,
  SID_ChunksType,
  Tess_ChunksType,
  SIDGroupType,
  SIDGroups_ChunksType,
  ARC_ChunksType,
  FeatureConfigType,
  UserData,
  FeatureConfigArcType,
  FeatureConfigTessType,
  FeatureConfigSIDType,
  UserDataKeys,
  TessTaskType,
  ArcTaskLogType,
  DayClassifierType,
  UserDataValues,
};

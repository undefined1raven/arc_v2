import { ColorValueHex } from "@/components/common/CommonTypes";

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
  version: "0.1.0";
  lightColor: ColorValueHex;
  textLightColor: ColorValueHex;
  darkColor: ColorValueHex;
  textDarkColor: ColorValueHex;
  completionEffect: number;
};
type TessLabelType = {
  labelID: string;
  name: string;
  deleted: boolean;
  version: "0.1.0";
  lightColor: ColorValueHex;
  textLightColor: ColorValueHex;
  darkColor: ColorValueHex;
  textDarkColor: ColorValueHex;
  completionMultiplier: Function;
};
type FeatureConfigTessType = {
  statusArray: TessStatusType[];
  labelArray: TessLabelType[];
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
  isComplete: boolean;
};

type Tess_ChunksType = {
  id: string;
  userID: string;
  encryptedContent: string;
  tx: number;
  version: "0.1.1";
  isComplete: boolean;
};

type SID_ChunksType = {
  id: string;
  userID: string;
  encryptedContent: string;
  tx: number;
  version: "0.1.1";
};

export type {
  ARCTasksType,
  ARCCategoryType,
  TessStatusType,
  TessLabelType,
  SIDMoodType,
  ARC_ChunksType,
  FeatureConfigType,
  UserData,
  FeatureConfigArcType,
  FeatureConfigTessType,
  FeatureConfigSIDType,
  UserDataKeys,
  ArcTaskLogType,
  UserDataValues,
};

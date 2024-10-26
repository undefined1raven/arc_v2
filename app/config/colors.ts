import { ColorValueHex } from "@/components/common/CommonTypes";
import { PageBackgroundColorArrayType } from "@/hooks/globalStyles";
type ThemeColorsType = {
  color: ColorValueHex;
  colorAccent: ColorValueHex;
  textColor: ColorValueHex;
  textColorAccent: ColorValueHex;
  textColorInactive: ColorValueHex;
  colorInactive: ColorValueHex;
  successColor: ColorValueHex;
  successTextColor: ColorValueHex;
  colorAlt: ColorValueHex;
  errorColor: ColorValueHex;
  errorTextColor: ColorValueHex;
  pageBackgroundColors: PageBackgroundColorArrayType;
  statusBarColor: ColorValueHex;
  androidRippleColor: ColorValueHex;
};

type AvailableThemes =
  | "sneaky"
  | "dark"
  | "light"
  | "limeLight"
  | "turcois"
  | "brown"
  | "cutuSmaraldUpdate"
  | "cutuSmarald"
  | "cerulRatonas"
  | "ravenPurp"
  | "ravensPurp";

type Themes = {
  dark: ThemeColorsType;
  light: ThemeColorsType;
  limeLight: ThemeColorsType;
  turcois: ThemeColorsType;
  sneaky: ThemeColorsType;
  brown: ThemeColorsType;
  cutuSmaraldUpdate: ThemeColorsType;
  cutuSmarald: ThemeColorsType;
  cerulRatonas: ThemeColorsType;
  ravenPurp: ThemeColorsType;
  ravensPurp: ThemeColorsType;
};

const themeColors: Themes = {
  ravensPurp: {
    androidRippleColor: "#ffffff",
    statusBarColor: "#391665",
    colorAlt: "#AD79EF",
    pageBackgroundColors: ["#391665", "#230746"],
    color: "#A57EF8",
    colorAccent: "#845FD0",
    textColor: "#9871EB",
    textColorAccent: "#8058C1",
    textColorInactive: "#212121",
    colorInactive: "#585186",
    successColor: "#008464",
    successTextColor: "#005843",
    errorColor: "#ff0000",
    errorTextColor: "#ae0000",
  },
  sneaky: {
    androidRippleColor: "#000000",
    statusBarColor: "#BEB4FF",
    pageBackgroundColors: ["#471F5B", "#885C9D"],
    color: "#412D5B",
    colorAlt: "#AD79EF",
    colorAccent: "#514792",
    textColor: "#412D5B",
    textColorAccent: "#312772",
    textColorInactive: "#212121",
    colorInactive: "#585186",
    successColor: "#008464",
    successTextColor: "#005843",
    errorColor: "#ff0000",
    errorTextColor: "#ae0000",
  },
  cerulRatonas: {
    androidRippleColor: "#000000",
    statusBarColor: "#BEB4FF",
    pageBackgroundColors: ["#1BB5E6", "#71D6F6"],
    color: "#3A5268",
    colorAccent: "#514792",
    textColor: "#3A5268",
    textColorAccent: "#312772",
    textColorInactive: "#212121",
    colorInactive: "#585186",
    successColor: "#008464",
    colorAlt: "#AD79EF",
    successTextColor: "#005843",
    errorColor: "#ff0000",
    errorTextColor: "#ae0000",
  },
  cutuSmaraldUpdate: {
    androidRippleColor: "#000000",
    statusBarColor: "#BEB4FF",
    pageBackgroundColors: ["#228B22", "#50C878"],
    color: "#BBAFA2",
    colorAccent: "#514792",
    colorAlt: "#AD79EF",
    textColor: "#BBAFA2",
    textColorAccent: "#312772",
    textColorInactive: "#212121",
    colorInactive: "#585186",
    successColor: "#008464",
    successTextColor: "#005843",
    errorColor: "#ff0000",
    errorTextColor: "#ae0000",
  },
  cutuSmarald: {
    androidRippleColor: "#000000",
    statusBarColor: "#BEB4FF",
    pageBackgroundColors: ["#1E7326", "#68B970"],
    colorAlt: "#AD79EF",
    color: "#BBAFA2",
    colorAccent: "#514792",
    textColor: "#BBAFA2",
    textColorAccent: "#312772",
    textColorInactive: "#212121",
    colorInactive: "#585186",
    successColor: "#008464",
    successTextColor: "#005843",
    errorColor: "#ff0000",
    errorTextColor: "#ae0000",
  },

  brown: {
    androidRippleColor: "#000000",
    statusBarColor: "#BEB4FF",
    pageBackgroundColors: ["#676767", "#676767"],
    color: "#BBAFA2",
    colorAccent: "#514792",
    textColor: "#BBAFA2",
    textColorAccent: "#312772",
    colorAlt: "#AD79EF",
    textColorInactive: "#212121",
    colorInactive: "#585186",
    successColor: "#008464",
    successTextColor: "#005843",
    errorColor: "#ff0000",
    errorTextColor: "#ae0000",
  },
  turcois: {
    androidRippleColor: "#000000",
    statusBarColor: "#BEB4FF",
    pageBackgroundColors: ["#9DC10D", "#9DC10D"],
    color: "#123143",
    colorAccent: "#514792",
    colorAlt: "#AD79EF",
    textColor: "#123143",
    textColorAccent: "#312772",
    textColorInactive: "#212121",
    colorInactive: "#585186",
    successColor: "#008464",
    successTextColor: "#005843",
    errorColor: "#ff0000",
    errorTextColor: "#ae0000",
  },
  limeLight: {
    androidRippleColor: "#232B0F",
    statusBarColor: "#9DC10D",
    pageBackgroundColors: ["#9DC10D", "#9DC10D"],
    color: "#123143",
    colorAccent: "#5D710F",
    textColor: "#232B0F",
    textColorAccent: "#4E5931",
    textColorInactive: "#7B8D4A",
    colorAlt: "#AD79EF",
    colorInactive: "#585186",
    successColor: "#0B6E27",
    successTextColor: "#042B0F",
    errorColor: "#ff0000",
    errorTextColor: "#ae0000",
  },

  light: {
    androidRippleColor: "#000050",
    statusBarColor: "#BEB4FF",
    pageBackgroundColors: ["#BEB4FF", "#ACA0FD"],
    color: "#0b004f",
    colorAccent: "#514792",
    textColor: "#0b004f",
    textColorAccent: "#312772",
    textColorInactive: "#212121",
    colorAlt: "#AD79EF",
    colorInactive: "#585186",
    successColor: "#008464",
    successTextColor: "#005843",
    errorColor: "#ff0000",
    errorTextColor: "#ae0000",
  },

  dark: {
    androidRippleColor: "#2400ff",
    statusBarColor: "#04030E",
    pageBackgroundColors: ["#04030E", "#0B0727"],
    color: "#4627FF",
    colorAccent: "#150098",
    textColor: "#9E8EFF",
    textColorAccent: "#584D99",
    textColorInactive: "#343244",
    colorAlt: "#644BFF",
    colorInactive: "#373252",
    successColor: "#4FFF96",
    successTextColor: "#4FFF96",
    errorColor: "#D7000D",
    errorTextColor: "#FF004D",
  },
};
const y = {
  dark: {
    androidRippleColor: "#2400ff",
    statusBarColor: "#04030E",
    pageBackgroundColors: ["#04030E", "#0B0727"],
    color: "#2400FF",
    colorAccent: "#150098",
    textColor: "#9E8EFF",
    textColorAccent: "#584D99",
    colorAlt: "#AD79EF",
    textColorInactive: "#343244",
    colorInactive: "#373252",
    successColor: "#4FFF96",
    successTextColor: "#4FFF96",
    errorColor: "#D7000D",
    errorTextColor: "#FF004D",
  },
};
const x = ["#362a34", "#de98b0", "#ad61b4", "#8279d2"];
export type { ThemeColorsType, Themes, AvailableThemes };
export default themeColors;

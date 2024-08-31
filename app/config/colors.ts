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
  errorColor: ColorValueHex;
  errorTextColor: ColorValueHex;
  pageBackgroundColors: PageBackgroundColorArrayType;
  statusBarColor: ColorValueHex;
  androidRippleColor: ColorValueHex;
};

type Themes = {
  dark: ThemeColorsType;
  light: ThemeColorsType;
  limeLight: ThemeColorsType;
  turcois: ThemeColorsType;
  brown: ThemeColorsType;
  cutuSmaraldUpdate: ThemeColorsType;
  cutuSmarald: ThemeColorsType;
  cerulRatonas: ThemeColorsType;
  ravenPurp: ThemeColorsType;
  ravensPurp: ThemeColorsType;
};

const themeColors: Themes = {
  light: {
    androidRippleColor: "#000000",
    statusBarColor: "#391665",
    pageBackgroundColors: ["#391665", "#230746"],
    color: "#A57EF8",
    colorAccent: "#514792",
    textColor: "#9871EB",
    textColorAccent: "#312772",
    textColorInactive: "#212121",
    colorInactive: "#585186",
    successColor: "#008464",
    successTextColor: "#005843",
    errorColor: "#ff0000",
    errorTextColor: "#ae0000",
  },
  ravensPurp: {
    androidRippleColor: "#000000",
    statusBarColor: "#BEB4FF",
    pageBackgroundColors: ["#471F5B", "#885C9D"],
    color: "#412D5B",
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
    colorInactive: "#585186",
    successColor: "#0B6E27",
    successTextColor: "#042B0F",
    errorColor: "#ff0000",
    errorTextColor: "#ae0000",
  },

  ravenPurp: {
    androidRippleColor: "#000000",
    statusBarColor: "#BEB4FF",
    pageBackgroundColors: ["#BEB4FF", "#ACA0FD"],
    color: "#0b004f",
    colorAccent: "#514792",
    textColor: "#0b004f",
    textColorAccent: "#312772",
    textColorInactive: "#212121",
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
    color: "#2400FF",
    colorAccent: "#150098",
    textColor: "#9E8EFF",
    textColorAccent: "#584D99",
    textColorInactive: "#343244",
    colorInactive: "#373252",
    successColor: "#4FFF96",
    successTextColor: "#4FFF96",
    errorColor: "#D7000D",
    errorTextColor: "#FF004D",
  },
};
const y =   {dark: {
  androidRippleColor: "#2400ff",
  statusBarColor: "#04030E",
  pageBackgroundColors: ["#04030E", "#0B0727"],
  color: "#2400FF",
  colorAccent: "#150098",
  textColor: "#9E8EFF",
  textColorAccent: "#584D99",
  textColorInactive: "#343244",
  colorInactive: "#373252",
  successColor: "#4FFF96",
  successTextColor: "#4FFF96",
  errorColor: "#D7000D",
  errorTextColor: "#FF004D",
}}
const x = ['#362a34', '#de98b0', '#ad61b4', '#8279d2']
export type { ThemeColorsType, Themes };
export default themeColors;

import { ColorValueHex } from "@/components/common/CommonTypes";
import { PageBackgroundColorArrayType } from "@/hooks/globalStyles";
type ThemeColorsType = {
  dark: {
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
  light: {
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
  cloudy: ThemeColorsType;
  turcois: ThemeColorsType;
  brown: ThemeColorsType;
  cutuSmaraldUpdate: ThemeColorsType;
  cerulRatonas: ThemeColorsType;
  ravensPurp: ThemeColorsType;
  sangeRed: ThemeColorsType;
  paper: ThemeColorsType;
  monochromeGray: ThemeColorsType;
};
const themeColorKeyToDisplayName = {
  cloudy: "Cloudy",
  limeLight: "Lime Light",
  turcois: "Turcois",
  sneaky: "Sneaky",
  brown: "Brown",
  cutuSmaraldUpdate: "Cutu Smarald Update",
  cutuSmarald: "Cutu Smarald",
  cerulRatonas: "Cerul Ratonas",
  ravenPurp: "Raven Purp",
  ravensPurp: "Ravens Purp",
  sangeRed: "Sânge red",
  monochromeGray: "Monochrome Gray",
  paper: "Paper",
};

export { themeColorKeyToDisplayName };

const themeColors: Themes = {
  ravensPurp: {
    dark: {
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
    light: {
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
  },
  cerulRatonas: {
    dark: {
      androidRippleColor: "#000000",
      statusBarColor: "#1BB5E6",
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
    light: {
      androidRippleColor: "#000000",
      statusBarColor: "#1BB5E6",
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
  },
  sangeRed: {
    light: {
      androidRippleColor: "#000000",
      statusBarColor: "#770002",
      pageBackgroundColors: ["#770002", "#390405"],
      color: "#FF4F52",
      colorAccent: "#C01619",
      colorAlt: "#FF8C8E",
      textColor: "#FF4447",
      textColorAccent: "#B2272A",
      textColorInactive: "#964142",
      colorInactive: "#955152",
      successColor: "#FF7799",
      successTextColor: "#FFBACB",
      errorColor: "#FF8800",
      errorTextColor: "#FFBC70",
    },
    dark: {
      androidRippleColor: "#000000",
      statusBarColor: "#770002",
      pageBackgroundColors: ["#770002", "#390405"],
      color: "#FF4F52",
      colorAccent: "#C01619",
      colorAlt: "#FF8C8E",
      textColor: "#FF4447",
      textColorAccent: "#B2272A",
      textColorInactive: "#964142",
      colorInactive: "#955152",
      successColor: "#FF7799",
      successTextColor: "#FFBACB",
      errorColor: "#FF8800",
      errorTextColor: "#FFBC70",
    },
  },
  monochromeGray: {
    light: {
      androidRippleColor: "#000000",
      statusBarColor: "#000000",
      pageBackgroundColors: ["#000000", "#000000"],
      color: "#767676",
      colorAccent: "#383838",
      colorAlt: "#767676",
      textColor: "#767676",
      textColorAccent: "#383838",
      textColorInactive: "#212121",
      colorInactive: "#212121",
      successColor: "#D6D6D6",
      successTextColor: "#D6D6D6",
      errorColor: "#F59696",
      errorTextColor: "#F59696",
    },
    dark: {
      androidRippleColor: "#000000",
      statusBarColor: "#000000",
      pageBackgroundColors: ["#000000", "#000000"],
      color: "#767676",
      colorAccent: "#383838",
      colorAlt: "#767676",
      textColor: "#767676",
      textColorAccent: "#383838",
      textColorInactive: "#212121",
      colorInactive: "#212121",
      successColor: "#D6D6D6",
      successTextColor: "#D6D6D6",
      errorColor: "#F59696",
      errorTextColor: "#F59696",
    },
  },
  cutuSmaraldUpdate: {
    dark: {
      androidRippleColor: "#000000",
      statusBarColor: "#228B22",
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
    light: {
      androidRippleColor: "#000000",
      statusBarColor: "#228B22",
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
  },
  brown: {
    light: {
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
    dark: {
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
  },
  turcois: {
    light: {
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
    dark: {
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
  },
  cloudy: {
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
  },
  paper: {
    light: {
      androidRippleColor: "#333333",
      statusBarColor: "#FFFFFF",
      pageBackgroundColors: ["#FFFFFF", "#FFFFFF"],
      color: "#020202",
      colorAccent: "#202020",
      textColor: "#151515",
      textColorAccent: "#303030",
      textColorInactive: "#999999",
      colorAlt: "#454580",
      colorInactive: "#AAAAAA",
      successColor: "#008464",
      successTextColor: "#005843",
      errorColor: "#FF6666",
      errorTextColor: "#FFAAAA",
    },
    dark: {
      androidRippleColor: "#333333",
      statusBarColor: "#FFFFFF",
      pageBackgroundColors: ["#FFFFFF", "#FFFFFF"],
      color: "#020202",
      colorAccent: "#202020",
      textColor: "#151515",
      textColorAccent: "#303030",
      textColorInactive: "#999999",
      colorAlt: "#454580",
      colorInactive: "#AAAAAA",
      successColor: "#008464",
      successTextColor: "#005843",
      errorColor: "#FF6666",
      errorTextColor: "#FFAAAA",
    },
  },
};
export type { ThemeColorsType, Themes, AvailableThemes };
export default themeColors;

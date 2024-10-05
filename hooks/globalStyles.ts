import themeColors, { Themes, ThemeColorsType } from "@/app/config/colors";
import { createSlice } from "@reduxjs/toolkit";
import { ColorValueHex } from "@/components/common/CommonTypes";

type PageBackgroundColorArrayType = ColorValueHex[];

type GlobalStyleType = {
  borderRadius: number;
  borderRadius20: number;
  borderRadius10: number;
  largeDesktopFont: number;
  veryLargeDesktopFont: number;
  verySmallDesktopFont: number;
  titleDesktopFont: number;
  regularDesktopFont: number;
  smallDesktopFont: number;
  mediumDesktopFont: number;
  footnoteDesktopFont: number;
  veryLargeMobileFont: number;
  largeMobileFont: number;
  regularMobileFont: number;
  mediumMobileFont: number;
  smallMobileFont: number;
  footnoteMobileFont: number;
  theme: Themes;
  color: ColorValueHex;
  colorAccent: ColorValueHex;
  colorAlt: ColorValueHex;
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

const globalStyle = createSlice({
  name: "globalStyle",
  initialState: {
    borderRadius: 5,
    borderRadius20: 20,
    borderRadius10: 10,
    largeDesktopFont: 27,
    veryLargeDesktopFont: 30,
    verySmallDesktopFont: 15,
    titleDesktopFont: 60,
    regularDesktopFont: 25,
    smallDesktopFont: 12,
    mediumDesktopFont: 21,
    footnoteDesktopFont: 12,
    veryLargeMobileFont: 31,
    largeMobileFont: 19,
    regularMobileFont: 16,
    mediumMobileFont: 14,
    smallMobileFont: 10,
    footnoteMobileFont: 8,
    theme: "light",
    ...themeColors.light,
  },
  reducers: {
    updateGlobalStyle: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export type { GlobalStyleType, PageBackgroundColorArrayType };
export const { updateGlobalStyle } = globalStyle.actions;
export default globalStyle.reducer;

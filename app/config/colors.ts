import { ColorValueHex } from "@/components/common/CommonTypes";
import { PageBackgroundColorArrayType } from "@/hooks/globalStyles";
type ThemeColorsType = {
    color: ColorValueHex,
    colorAccent: ColorValueHex,
    textColor: ColorValueHex,
    textColorAccent: ColorValueHex,
    textColorInactive: ColorValueHex,
    colorInactive: ColorValueHex,
    successColor: ColorValueHex,
    successTextColor: ColorValueHex,
    errorColor: ColorValueHex,
    errorTextColor: ColorValueHex,
    pageBackgroundColors: PageBackgroundColorArrayType,
    statusBarColor: ColorValueHex

}

type Themes = { 'dark': ThemeColorsType, 'light': ThemeColorsType };

const themeColors: Themes = {
    light: { statusBarColor: '#BEB4FF', pageBackgroundColors: ['#BEB4FF', '#7E75B5'], color: '#0b004f', colorAccent: '#514792', textColor: '#0b004f', textColorAccent: '#312772', textColorInactive: '#212121', colorInactive: '#585186', successColor: '#008464', successTextColor: '#005843', errorColor: '#ff0000', errorTextColor: '#ae0000' },
    dark: { statusBarColor: '#04030E', pageBackgroundColors: ['#04030E', '#0B0727'], color: '#2400FF', colorAccent: '#150098', textColor: '#9E8EFF', textColorAccent: '#584D99', textColorInactive: '#343244', colorInactive: '#373252', successColor: '#4FFF96', successTextColor: '#4FFF96', errorColor: '#D7000D', errorTextColor: '#FF004D' }
};
export type { ThemeColorsType, Themes };
export default themeColors;
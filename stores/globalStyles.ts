import themeColors from "@/app/config/colors";
import { create } from "zustand";

const useGlobalStyleStore = create((set) => ({
  globalStyle: {
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
  updateGlobalStyle: (newStyles: object) => {
    set((state) => {
      return { globalStyle: { ...state.globalStyle, ...newStyles } };
    });
  },
}));

export { useGlobalStyleStore };

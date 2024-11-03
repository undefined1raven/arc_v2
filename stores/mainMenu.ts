import { DayPlannerIcon } from "@/components/common/deco/DayPlannerIcon";
import { HomeIcon } from "@/components/common/deco/HomeIcon";
import { PersonalDiaryIcon } from "@/components/common/deco/PersonalDiaryIcon";
import { QuestionIcon } from "@/components/common/deco/QuestionIcon";
import { SettingdIcon } from "@/components/common/deco/SettingsIcon";
import { TimeStatsIcon } from "@/components/common/deco/TimeStatsIcon";
import { ReactElement } from "react";
import { create } from "zustand";
type MenuButtonType = "contextMenu" | "home" | "settings";
type MenuConfigType = { buttons: MenuButtonType[]; visible: boolean };
export type MenuOverlayButtons =
  | "help"
  | "timeStats"
  | "dayPlanner"
  | "home"
  | "diary"
  | "settings"
  | "account";

export type MenuOverlayButtonType = {
  id: MenuOverlayButtons;
  label: string;
  icon: ReactElement;
  screenName?: string;
};

export interface MenuConfigStore {
  menuOverlayConfig: {
    buttons: MenuOverlayButtonType[];
    visible: boolean;
  };
  menuConfig: MenuConfigType;
  updateMenuConfig: (payload: {
    buttons: MenuButtonType[];
    visible: boolean;
  }) => void;
  hideMenu: () => void;
  showMenu: () => void;
  setOverlayMenuVisibility: (visible: boolean) => void;
}

const useMenuConfigStore = create<MenuConfigStore>((set) => ({
  menuOverlayConfig: {
    buttons: [
      { id: "home", label: "Home", icon: HomeIcon, screenName: "Home" },
      {
        id: "timeStats",
        label: "Explore Time Spent",
        icon: TimeStatsIcon,
        screenName: "timeStats",
      },
      {
        id: "dayPlanner",
        label: "Day Planner",
        icon: DayPlannerIcon,
        screenName: "dayPlanner",
      },
      {
        id: "diary",
        label: "Personal Diary",
        icon: PersonalDiaryIcon,
        screenName: "diaryMain",
      },
      {
        id: "account",
        label: "Account Settings",
        icon: SettingdIcon,
        screenName: "Home",
      },
      { id: "help", label: "Help", icon: QuestionIcon, screenName: "home" },
    ],
    visible: false,
  },
  menuConfig: { buttons: ["settings", "home", "contextMenu"], visible: true },
  updateMenuConfig: (payload: {
    buttons: MenuButtonType[];
    visible: boolean;
  }) => {
    set((state) => {
      return { menuConfig: { ...state.menuConfig, ...payload } };
    });
  },
  hideMenu: () => {
    set((state) => {
      return { menuConfig: { ...state.menuConfig, visible: false } };
    });
  },
  showMenu: () => {
    set((state) => {
      return { menuConfig: { ...state.menuConfig, visible: true } };
    });
  },
  setOverlayMenuVisibility: (visible: boolean) => {
    set((state) => {
      return { menuOverlayConfig: { ...state.menuOverlayConfig, visible } };
    });
  },
}));

export { useMenuConfigStore };

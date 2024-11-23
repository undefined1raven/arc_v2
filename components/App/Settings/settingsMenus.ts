import { create } from "zustand";

export interface IMenu {
  title: string;
  id: string;
  options: {
    label: string;
    name: string;
    showIcon: boolean;
    description: string;
    icon: null | React.FC;
    screenName: string;
  }[];
}

interface SettingsMenus {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  menus: IMenu[];
  getActiveMenu: () => IMenu;
}

export const useSettingsMenus = create<SettingsMenus>((set, get) => ({
  activeMenu: "account",
  getActiveMenu: () => {
    const menus = get().menus;
    return menus.find((menu) => menu.id === get().activeMenu) || menus[0];
  },
  setActiveMenu: (menu) => set({ activeMenu: menu }),
  menus: [
    {
      title: "Config / Account Settings",
      id: "account",
      options: [
        {
          label: "Themes",
          name: "themes",
          showIcon: false,
          icon: null,
          screenName: "themeSettings",
          description: "Change the appearance of Arc",
        },
        {
          label: "Switch Account Type",
          name: "switchAccountType",
          showIcon: false,
          icon: null,
          screenName: "switchAccountType",
          description: "Tap to learn more",
        },
        {
          label: "Security",
          name: "Security",
          showIcon: false,
          icon: null,
          screenName: "switchAccountType",
          description: "Security settings",
        },
      ],
    },
  ],
}));

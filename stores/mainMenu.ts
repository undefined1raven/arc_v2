import { create } from "zustand";
type MenuButtonType = "contextMenu" | "home" | "settings";
type MenuConfigType = { buttons: MenuButtonType[]; visible: boolean };
const useMenuConfigStore = create((set) => ({
  menuConfig: { buttons: ["contextMenu", "home", "settings"], visible: true },
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
}));

export { useMenuConfigStore };

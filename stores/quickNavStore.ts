import { create } from "zustand";

type quickNavMenuType = {
  buttonID: string;
  label: string;
  onClick: Function;
  startBound?: number;
  endBound?: number;
};
interface QuickNavMenuStore {
  quickNavMenu: quickNavMenuType[];
  setQuickNavMenu: (quickNavMenu: quickNavMenuType[]) => void;
  sliderProps: { y: number; height: number };
  activeButtonID: string | null;
  setActiveButtonID: (buttonID: string | null) => void;
  setSliderProps: (sliderProps: { y: number; height: number }) => void;
  setQuickNavMenuItemByID: (
    buttonID: string,
    menuItem: quickNavMenuType
  ) => void;
}
const useQuickNavStore = create<QuickNavMenuStore>((set) => ({
  quickNavMenu: [],
  activeButtonID: null,
  setActiveButtonID: (buttonID: string | null) =>
    set({ activeButtonID: buttonID }),
  setQuickNavMenu: (quickNavMenu: quickNavMenuType[]) =>
    set((store) => ({ quickNavMenu })),
  setQuickNavMenuItemByID: (buttonID: string, menuItem: quickNavMenuType) => {
    set((store: QuickNavMenuStore) => {
      if (
        store.quickNavMenu.length === 0 ||
        store.quickNavMenu.find((elm) => elm.buttonID === menuItem.buttonID) ===
          undefined
      ) {
        return { quickNavMenu: [...store.quickNavMenu, menuItem] };
      } else {
        return {
          quickNavMenu: store.quickNavMenu.map((item: quickNavMenuType) => {
            if (item.buttonID === buttonID) {
              return menuItem;
            } else {
              return item;
            }
          }),
        };
      }
    });
  },
  sliderProps: { y: 0, height: 0 },
  setSliderProps: (sliderProps: { y: number; height: number }) =>
    set({
      sliderProps,
    }),
}));

export { useQuickNavStore };
export type { quickNavMenuType };

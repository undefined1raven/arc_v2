import { create } from "zustand";

type NavigatorType = null | {
  navigate: (path: string, name: { name: string }) => void;
}; // Replace `ReactNativeNavigatorType` with the actual type of your React Native navigator

interface NavigatorStore {
  navigator: NavigatorType | null;
  setNavigator: (navigator: NavigatorType | null) => void;
}

const useNavigatorStore = create<NavigatorStore>((set) => ({
  navigator: null,
  setNavigator: (navigator) => set({ navigator }),
}));

export { useNavigatorStore };

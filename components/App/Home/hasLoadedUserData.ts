import { create } from "zustand";

interface IHasLoadedUserData {
  hasLoadedUserData: boolean;
  setHasLoadedUserData: (hasLoadedUserData: boolean) => void;
}

const useHasLoadedUserDataStore = create<IHasLoadedUserData>((set) => ({
  hasLoadedUserData: false,
  setHasLoadedUserData: (hasLoadedUserData) => set({ hasLoadedUserData }),
}));

export { useHasLoadedUserDataStore };

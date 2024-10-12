import { create } from "zustand";

interface IHasLoadedUserData {
  hasLoadedUserData: boolean;
  keyType: "simple" | "double";
  setKeyType: (keyType: "simple" | "double") => void;
  setHasLoadedUserData: (hasLoadedUserData: boolean) => void;
}

const useHasLoadedUserDataStore = create<IHasLoadedUserData>((set) => ({
  hasLoadedUserData: false,
  keyType: "simple",
  setKeyType: (keyType) => set({ keyType }),
  setHasLoadedUserData: (hasLoadedUserData) => set({ hasLoadedUserData }),
}));

export { useHasLoadedUserDataStore };

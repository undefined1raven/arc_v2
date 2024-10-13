import { create } from "zustand";

interface IHasLoadedUserData {
  hasLoadedUserData: boolean;
  hasTessKey: boolean;
  setHasTessKey: (hasTessKey: boolean) => void;
  hasStartedDecryption: boolean;
  setHasStartedDecryption: (hasStartedDecryption: boolean) => void;
  keyType: "simple" | "double";
  setKeyType: (keyType: "simple" | "double") => void;
  setHasLoadedUserData: (hasLoadedUserData: boolean) => void;
}

const useHasLoadedUserDataStore = create<IHasLoadedUserData>((set) => ({
  hasLoadedUserData: false,
  keyType: "simple",
  hasTessKey: false,
  setHasTessKey: (hasTessKey) => set({ hasTessKey }),
  hasStartedDecryption: false,
  setHasStartedDecryption: (hasStartedDecryption) =>
    set({ hasStartedDecryption }),
  setKeyType: (keyType) => set({ keyType }),
  setHasLoadedUserData: (hasLoadedUserData) => set({ hasLoadedUserData }),
}));

export { useHasLoadedUserDataStore };

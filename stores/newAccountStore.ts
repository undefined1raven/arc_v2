import { create } from "zustand";

interface NewAccountStore {
  isGeneratingAccountInfo: boolean;
  setIsGeneratingAccountInfo: (isGeneratingAccountInfo: boolean) => void;
  accountGenStartTime: number;
  setAccountGenStartTime: (accountGenStartTime: number) => void;
  isOffline: boolean;
  setIsOffline: (isOffline: boolean) => void;
}

export const useNewAccountStore = create<NewAccountStore>((set) => ({
  isOffline: false,
  setIsOffline: (isOffline: boolean) => set({ isOffline }),
  setIsGeneratingAccountInfo: (isGeneratingAccountInfo: boolean) =>
    set({ isGeneratingAccountInfo }),
  isGeneratingAccountInfo: false,
  setAccountGenStartTime: (accountGenStartTime: number) =>
    set({ accountGenStartTime }),
  accountGenStartTime: 0,
}));

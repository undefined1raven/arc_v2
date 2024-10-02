import { create } from "zustand";

interface EncryptionState {
  encryptedData: { [key: string]: string };
  plain: { [key: string]: string };
  setPlain: (newPlain: { [key: string]: string }) => void;
  setEncryptedData: (data: { [key: string]: string }) => void;
}

const useEncryptionStore = create<EncryptionState>((set, get) => ({
  encryptedData: {},
  plain: {},
  setPlain: (newPlain: { [key: string]: string }) => {
    set({ plain: { ...get().plain, ...newPlain } });
  },
  setEncryptedData: (data) =>
    set({ encryptedData: { ...get().encryptedData, ...data } }),
}));

export default useEncryptionStore;

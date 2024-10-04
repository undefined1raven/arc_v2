import { create } from "zustand";

interface EncryptionState {
  encryptedData: string | null;
  plain: string | null;
  setPlain: (newPlain: string | null) => void;
  setEncryptedData: (data: string | null) => void;
}

const useEncryptionStore = create<EncryptionState>((set, get) => ({
  encryptedData: null,
  plain: null,
  setPlain: (newPlain: string | null) => {
    set({ plain: newPlain });
  },
  setEncryptedData: (data) => set({ encryptedData: data }),
}));

export default useEncryptionStore;

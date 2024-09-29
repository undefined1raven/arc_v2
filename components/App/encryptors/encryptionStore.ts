import { create } from "zustand";

interface EncryptionState {
  encryptedData: string | null;
  plain: string | null;
  setPlain: (text: string | null) => void;
  setEncryptedData: (data: string) => void;
}

const useEncryptionStore = create<EncryptionState>((set) => ({
  encryptedData: null,
  plain: null,
  setPlain: (text: string | null) => set({ plain: text }),
  setEncryptedData: (data) => set({ encryptedData: data }),
}));

export default useEncryptionStore;

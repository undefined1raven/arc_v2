import { create } from "zustand";

interface DecryptionState {
  decryptedData: string | null;
  cipherText: string | null;
  setCipherText: (text: string | null) => void;
  setDecryptedData: (data: string) => void;
}

const useDecryptionStore = create<DecryptionState>((set) => ({
  decryptedData: null,
  cipherText: null,
  setCipherText: (text: string | null) => set({ cipherText: text }),
  setDecryptedData: (data) => set({ decryptedData: data }),
}));

export default useDecryptionStore;

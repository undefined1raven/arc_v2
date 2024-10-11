import { create } from "zustand";

interface EncryptionState {
  encryptedData: {
    transactionID: string | null | undefined;
    encryptedData: string;
  } | null;
  plain: string | null;
  transactionID: string | null;
  setTransactionID: (newID: string | null | undefined) => void;
  setPlain: (newPlain: string | null) => void;
  setEncryptedData: (
    data: {
      transactionID: string | null | undefined;
      encryptedData: string;
    } | null
  ) => void;
}

const useEncryptionStore = create<EncryptionState>((set, get) => ({
  encryptedData: null,
  plain: null,
  transactionID: null,
  setTransactionID: (newID: string | null | undefined) => {
    set({ transactionID: newID });
  },
  setPlain: (newPlain: string | null) => {
    set({ plain: newPlain });
  },
  setEncryptedData: (data) => set({ encryptedData: data }),
}));

export default useEncryptionStore;

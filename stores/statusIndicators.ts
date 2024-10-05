import { create } from "zustand";

interface StatusIndicatorsState {
  setEncrypting: (loading: boolean) => void;
  encrypting: boolean;
}

const useStatusIndicatorsStore = create<StatusIndicatorsState>((set) => ({
  encrypting: false,
  setEncrypting: (loading) => set({ encrypting: loading }),
}));

export default useStatusIndicatorsStore;

import { create } from "zustand";

export interface LoadingScreenMessageType {
  loadingScreenMessage: {
    message: string;
    initialTime: number;
    redirect?: string;
  };
}

interface LoadingScreenMessageStore {
  loadingScreenMessage: { message: string; initialTime: number };
  updateLoadingScreenMessage: (newLoadingScreenMessage: {
    message: string;
    initialTime: number;
    redirect?: string;
  }) => void;
}

const useLoadingScreenMessageStore = create<LoadingScreenMessageStore>(
  (set) => ({
    loadingScreenMessage: { message: "Reading local data", initialTime: 0 },
    updateLoadingScreenMessage: (newLoadingScreenMessage) => {
      set((state: LoadingScreenMessageType) => {
        return {
          loadingScreenMessage: {
            ...state.loadingScreenMessage,
            ...newLoadingScreenMessage,
          },
        };
      });
    },
  })
);

export { useLoadingScreenMessageStore };

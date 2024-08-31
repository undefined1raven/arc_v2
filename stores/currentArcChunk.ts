import { ArcTaskLogType } from "@/app/config/commonTypes";
import { create } from "zustand";

type CurrentArcChunk = {
  id: string;
  userID: string;
  activities: ArcTaskLogType[];
  version: string;
  isComplete: boolean;
};

interface CurrentArcChunkStore {
  chunk: CurrentArcChunk | null;
  setChunk: (chunk: CurrentArcChunk | null) => void;
  lastChunkID: string | null;
  setLastChunkID: (id: string | null) => void;
  appendActivity: (activity: ArcTaskLogType) => void;
}

const useCurrentArcChunkStore = create<CurrentArcChunkStore>((set) => ({
  chunk: null,
  setChunk: (chunk) => set({ chunk }),
  lastChunkID: null,
  setLastChunkID: (id) => set({ lastChunkID: id }),
  appendActivity: (activity) => {
    set((state: CurrentArcChunkStore) => {
      if (state.chunk === null) return;
      return {
        chunk: {
          ...state.chunk,
          activities: [...state.chunk.activities, activity],
        },
      };
    });
  },
}));

export { useCurrentArcChunkStore };

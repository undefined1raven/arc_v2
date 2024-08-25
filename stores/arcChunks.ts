import { decrypt } from "@/fn/crypto/decrypt";
import { create } from "zustand";
type arcChunkStore = {
  chunkID: string;
  activities: { taskID: string; tx: number }[];
  tx: number;
  version: "0.1.1";
}[];
const useStore = create((set) => ({
  arcChunks: [],
  decryptionQueue: [],
  appendDecryptionQueue: (id: string | string[]) => {
    set((state) => {
      if (Array.isArray(id)) {
        return { decryptionQueue: [...state.decryptionQueue, ...id] };
      } else {
        return { decryptionQueue: [...state.decryptionQueue, id] };
      }
    });
  },
  removeChunkFromDecryptionQueue: (id: string | string[]) => {
    set((state) => {
      return {
        decryptionQueue: state.decryptionQueue.filter((lid) => lid !== id),
      };
    });
  },
  addChunkToArcChunks: (chunk: {
    id: string;
    tx: number;
    activities: any[];
    version: "0.1.1";
    userID: string;
  }) => {
    set((state) => {
      return { arcChunks: [...state.arcChunks, chunk] };
    });
  },
  addActivityToArcChunk: (
    id: string,
    activity: { taskID: string; tx: number }
  ) =>
    set((state) => {
      const newArcChunks = state.arcChunks.map((arcChunk) => {
        console.log(activity, "activity");
        if (arcChunk.id === id) {
          return {
            ...arcChunk,
            activities: [...arcChunk.activities, activity],
          };
        }
        return arcChunk;
      });
      return { arcChunks: newArcChunks };
    }),
}));

export { useStore };

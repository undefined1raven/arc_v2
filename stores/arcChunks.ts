import { create } from "zustand";
type arcChunkStore = {
  chunkID: string;
  activities: { taskID: string; tx: number }[];
  chunkTX: number;
}[];
const useStore = create((set) => ({
  arcChunks: [{ chunkID: "1", activities: [], chunkTX: 0 }],
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
  addActivityToArcChunk: (
    id: string,
    activity: { taskID: string; tx: number }
  ) =>
    set((state) => {
      const newArcChunks = state.arcChunks.map((arcChunk) => {
        if (arcChunk.chunkID === id) {
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

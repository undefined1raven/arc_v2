import { create } from "zustand";

const useStore = create((set) => ({
  arcChunks: [{ chunkID: "1", activities: [], chunkTX: 0 }],
  arcChunkIDs: [],
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

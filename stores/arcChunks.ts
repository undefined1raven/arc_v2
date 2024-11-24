import { decrypt } from "@/fn/crypto/decrypt";
import arcChunks from "@/hooks/arcChunks";
import { create } from "zustand";
import { ARC_ChunksType } from "@/config/commonTypes";

interface arcChunkStore {
  arcChunks: ARC_ChunksType[];
  ini: boolean;
  writeLock: boolean;
  setWriteLock: (writeLock: boolean) => void;
  setIni: (ini: boolean) => void;
  decryptionQueue: string[];
  appendDecryptionQueue: (id: string | string[]) => void;
  removeChunkFromDecryptionQueue: (id: string | string[]) => void;
  addChunkToArcChunks: (chunk: {
    id: string;
    tx: number;
    activities: any[];
    version: "0.1.1";
    userID: string;
    isComplete: boolean;
  }) => void;
  addActivityToArcChunk: (
    id: string,
    activity: { taskID: string; tx: number }
  ) => void;
}
const useStore = create<arcChunkStore>((set) => ({
  arcChunks: [],
  ini: false,
  writeLock: true,
  setWriteLock: (writeLock: boolean) => set({ writeLock }),
  setIni: (ini: boolean) => set({ ini }),
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

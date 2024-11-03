import {
  SID_ChunksType,
  SIDGroups_ChunksType,
  SIDGroupType,
  SIDNoteType,
} from "@/app/config/commonTypes";
import { create } from "zustand";

interface SIDStoreType {
  groups: null | SIDGroupType[];
  notes: null | SIDNoteType[];
  setGroups: (groups: SIDGroupType[]) => void;
  setNotes: (notes: SIDNoteType[]) => void;
  lastNotesChunk: null | SID_ChunksType;
  lastGroupsChunk: null | SIDGroups_ChunksType;
  setLastNotesChunk: (chunk: SID_ChunksType) => void;
  setLastGroupsChunk: (chunk: SIDGroups_ChunksType) => void;
}

const useDiaryStore = create<SIDStoreType>((set) => ({
  lastGroupsChunk: null,
  setLastGroupsChunk: (chunk: SIDGroups_ChunksType) => {
    set({ lastGroupsChunk: chunk });
  },
  setLastNotesChunk: (chunk: SID_ChunksType) => {
    set({ lastNotesChunk: chunk });
  },
  lastNotesChunk: null,
  groups: null,
  notes: null,
  setGroups: (group: SIDGroupType[]) => {
    set({ groups: group });
  },
  setNotes: (notes: SIDNoteType[]) => {
    set({ notes: notes });
  },
}));

export default useDiaryStore;

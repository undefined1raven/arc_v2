import {
  SID_ChunksType,
  SIDGroups_ChunksType,
  SIDGroupType,
  SIDNoteType,
} from "@/app/config/commonTypes";
import { create } from "zustand";

interface SIDStoreType {
  groups: null | SIDGroupType[];
  notes: null | { note: SIDNoteType; chunkID: string }[];
  setGroups: (groups: SIDGroupType[]) => void;
  setNotes: (notes: { note: SIDNoteType; chunkID: string }[]) => void;
  lastNotesChunk: null | SID_ChunksType;
  lastGroupsChunk: null | SIDGroups_ChunksType;
  setLastNotesChunk: (chunk: SID_ChunksType) => void;
  setLastGroupsChunk: (chunk: SIDGroups_ChunksType) => void;
  selectedGroup: null | SIDGroupType;
  setSelectedGroup: (group: SIDGroupType) => void;
  selectedNote: null | { note: SIDNoteType; chunkID: string };
  setSelectedNote: (note: { note: SIDNoteType; chunkID: string }) => void;
}

const useDiaryStore = create<SIDStoreType>((set) => ({
  lastGroupsChunk: null,
  selectedGroup: null,
  selectedNote: null,
  setSelectedGroup: (group: SIDGroupType) => {
    set({ selectedGroup: group });
  },
  setSelectedNote: (note: { note: SIDNoteType; chunkID: string }) => {
    set({ selectedNote: note });
  },
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
  setNotes: (notes: { note: SIDNoteType; chunkID: string }[]) => {
    set({ notes: notes });
  },
}));

export default useDiaryStore;

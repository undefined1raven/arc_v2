import { create } from "zustand";

interface HasCheckedTablesStore {
  hasCheckedTables: boolean;
  updateHasCheckedTables: (newHasCheckedTables: boolean) => void;
}

const useHasCheckedTablesStore = create<HasCheckedTablesStore>((set) => ({
  hasCheckedTables: false,
  updateHasCheckedTables: (newHasCheckedTables) => {
    set((state) => {
      return { hasCheckedTables: newHasCheckedTables };
    });
  },
}));

export { useHasCheckedTablesStore };

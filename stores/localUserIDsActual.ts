import { create } from "zustand";

export interface LocalUserIDsType {
  authenticated: boolean;
  id: string;
  isActive: boolean;
}

interface LocalUserIDsStoreType {
  loaclUserIDs: LocalUserIDsType[];
  updateLocalUserIDs: (users: LocalUserIDsType[]) => LocalUserIDsType[];
}

const useLocalUserIDsStore = create<LocalUserIDsStoreType>((set) => ({
  localUserIDs: [],
  updateLocalUserIDs: (users) => {
    set((state) => {
      return { localUserIDs: [...users] };
    });
  },
}));

export { useLocalUserIDsStore };

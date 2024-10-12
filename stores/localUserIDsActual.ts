import { create } from "zustand";

export interface LocalUserIDsType {
  authenticated: boolean;
  id: string;
  isActive: boolean;
  hasTessKey: boolean;
}

interface LocalUserIDsStoreType {
  loaclUserIDs: LocalUserIDsType[];
  updateLocalUserIDs: (users: LocalUserIDsType[]) => LocalUserIDsType[];
  getActiveUserID: () => string | null;
}

const useLocalUserIDsStore = create<LocalUserIDsStoreType>((set, get) => ({
  localUserIDs: [],
  updateLocalUserIDs: (users) => {
    set((state) => {
      return { localUserIDs: [...users] };
    });
  },
  getActiveUserID: () => {
    const users = get().localUserIDs;
    for (let ix = 0; ix < users.length; ix++) {
      if (users[ix].isActive === true) {
        return users[ix].id;
      }
    }
    return null;
  },
}));

export { useLocalUserIDsStore };

import { create } from "zustand";

interface IrequestFullSpace {
  requestFullSpace: boolean;
  setrequestFullSpace: (requestFullSpace: boolean) => void;
}

export const useRequestFullSpace = create<IrequestFullSpace>((set) => ({
  requestFullSpace: false,
  setrequestFullSpace: (requestFullSpace) => set({ requestFullSpace }),
}));

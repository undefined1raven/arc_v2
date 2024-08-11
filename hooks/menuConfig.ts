import { createSlice } from "@reduxjs/toolkit";
type MenuButtonType = "contextMenu" | "home" | "settings";
type MenuConfigType = { buttons: MenuButtonType[]; visible: boolean };
const menuConfig = createSlice({
  name: "activeUser",
  initialState: { buttons: ["contextMenu", "home", "settings"], visible: true },
  reducers: {
    updateMenuConfig: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export type { MenuConfigType };
export const { updateMenuConfig } = menuConfig.actions;
const reducer = menuConfig.reducer;
export { reducer as menuConfigReducer };

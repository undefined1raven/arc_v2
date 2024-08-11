import { createSlice } from "@reduxjs/toolkit";

type HideHomeUIType = null | string;
const hideHomeUI = createSlice({
  name: "hideHomeUI",
  initialState: false,
  reducers: {
    updateHideHomeUI: (state, action) => {
      return action.payload;
    },
  },
});

export type { HideHomeUIType };
export const { updateHideHomeUI } = hideHomeUI.actions;
const reducer = hideHomeUI.reducer;
export { reducer as hideHomeUIReducer };

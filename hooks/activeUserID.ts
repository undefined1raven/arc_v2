import { createSlice } from "@reduxjs/toolkit";

type activeUserIDType = null | string;
const activeUser = createSlice({
  name: "activeUser",
  initialState: null,
  reducers: {
    updateActiveUser: (state, action) => {
      return action.payload;
    },
  },
});

export type { activeUserIDType };
export const { updateActiveUser } = activeUser.actions;
const reducer = activeUser.reducer;
export { reducer as activeUserIDReducer };

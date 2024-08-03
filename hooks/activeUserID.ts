import { createSlice } from "@reduxjs/toolkit";

type activeUserIDType = {
  activeUser: { authenticated: boolean; id: string | null };
};
const activeUser = createSlice({
  name: "activeUser",
  initialState: { activeUser: { authenticated: false, id: null } },
  reducers: {
    updateActiveUser: (state, action: activeUserIDType) => {
      return { activeUser: action };
    },
  },
});

export type { activeUserIDType };
export const { updateActiveUser } = activeUser.actions;
const reducer = activeUser.reducer;
export { reducer as activeUserIDReducer };

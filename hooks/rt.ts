import ActivitiesSettingsMain from "@/components/App/Settings/Activities/ActivitiesSettingsMain";
import { createSlice } from "@reduxjs/toolkit";

const rt = createSlice({
  name: "rt",
  initialState: '',
  reducers: {
    updateActiveUser: (state, action) => {
      return action.payload;
    },
  },
});

export const { updateActiveUser } = rt.actions;
const reducer = rt.reducer;
export { reducer as rts };

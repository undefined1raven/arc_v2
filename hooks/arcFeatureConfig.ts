import { createSlice } from "@reduxjs/toolkit";

const arcFeatureConfig = createSlice({
  name: "arcFeatureConfig",
  initialState: {},
  reducers: {
    updateArcFeatureConfig: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateArcFeatureConfig } = arcFeatureConfig.actions;
export default arcFeatureConfig.reducer;

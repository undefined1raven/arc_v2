import { ArcTaskLogType, ARCTasksType } from "@/app/config/commonTypes";
import { createSlice } from "@reduxjs/toolkit";

type ActivitiesArray = {
  chunkID: string;
  activities: ArcTaskLogType[];
  chunkTX: number;
}[];
export type { ActivitiesArray };
const arcChunks = createSlice({
  name: "arcChunks",
  initialState: { plainActivities: [], triggerChunkIDs: [] },
  reducers: {
    updateArcChunks: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateArcChunks } = arcChunks.actions;
export default arcChunks.reducer;

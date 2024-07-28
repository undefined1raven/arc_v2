import { createSlice } from "@reduxjs/toolkit";

type localUsersType = { users: { authenticated: boolean, id: string }[] }
const localUserIDs = createSlice({
    name: 'localUserIDs',
    initialState: { users: [] },
    reducers: {
        updateLocalUserIDs: (state, action) => {
            return { users: action.payload };
        }
    },
})

export type { localUsersType }
export const { updateLocalUserIDs } = localUserIDs.actions;
const reducer = localUserIDs.reducer;
export { reducer as localUserIDsReducer };
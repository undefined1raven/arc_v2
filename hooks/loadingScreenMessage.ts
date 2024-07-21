import { createSlice } from "@reduxjs/toolkit";


const loadingScreenMessage = createSlice({
    name: 'loadingScreenMessage',
    initialState: { message: 'Reading local data', initialTime: 0 },
    reducers: {
        updateLoadingScreenMessage: (state, action) => {
            return { state, ...action.payload }
        }
    },
})

export const { updateLoadingScreenMessage } = loadingScreenMessage.actions;
export default loadingScreenMessage.reducer;
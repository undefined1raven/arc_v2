import { configureStore } from "@reduxjs/toolkit";
import globalStyleReducer from '../hooks/globalStyles';

export default configureStore({
    reducer: { globalStyle: globalStyleReducer }
})
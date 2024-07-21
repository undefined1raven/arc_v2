import { configureStore } from "@reduxjs/toolkit";
import globalStyleReducer from '../hooks/globalStyles';
import loadingScreenMessageReducer from "@/hooks/loadingScreenMessage";
export default configureStore({
    reducer: { globalStyle: globalStyleReducer, loadingScreenMessage: loadingScreenMessageReducer }
})
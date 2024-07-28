import { configureStore } from "@reduxjs/toolkit";
import globalStyleReducer from '../hooks/globalStyles';
import loadingScreenMessageReducer from "@/hooks/loadingScreenMessage";
import { localUserIDsReducer } from "@/hooks/localUserIDs";
export default configureStore({
    reducer: { globalStyle: globalStyleReducer, loadingScreenMessage: loadingScreenMessageReducer, localUserIDs: localUserIDsReducer }
})